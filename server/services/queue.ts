import { Queue, Worker, Job } from 'bullmq';
import { env, isDevelopment } from '../config/env';
import { logger } from './logger';
import { storage } from '../storage';
import * as cheerio from 'cheerio';
import { genLayerService } from './genlayer';

/**
 * Queue configuration
 */
const hasRedis = !!env.REDIS_URL;
const connection = hasRedis ? { url: env.REDIS_URL } : undefined;

interface VerificationJobData {
  verificationId: string;
  url: string;
}

/**
 * Content verification queue
 */
export const verificationQueue = hasRedis ? new Queue<VerificationJobData>('content-verification', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 100,
      age: 24 * 3600,
    },
    removeOnFail: {
      count: 500,
    },
  },
}) : null;

/**
 * Fetch and clean URL content
 */
async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AuthenticityGate/1.0 (Content Verification Bot)',
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove scripts, styles, and boilerplate
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    $('header').remove();
    $('.advertisement').remove();
    $('.ad').remove();

    return $('body').text().replace(/\s+/g, ' ').trim().slice(0, 5000);
  } catch (error) {
    logger.error({ error, url }, 'Failed to fetch URL content');
    throw new Error(`Failed to fetch content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process verification job
 */
async function processVerification(job: Job<VerificationJobData>) {
  const { verificationId, url } = job.data;

  logger.info({ verificationId, url }, 'Processing verification job');

  try {
    // Update status to processing
    logger.info({ verificationId }, 'Step 1: Updating status to processing');
    await storage.updateVerification(verificationId, {
      status: 'processing',
    });

    // Fetch content
    logger.info({ verificationId, url }, 'Step 2: Fetching URL content');
    const textContent = await fetchUrlContent(url);
    logger.info({ verificationId, contentLength: textContent.length }, 'Content fetched successfully');

    // Analyze with GenLayer/Gemini
    logger.info({ verificationId }, 'Step 3: Calling GenLayer service for analysis');
    const analysis = await genLayerService.verifyContent(textContent);
    logger.info({ verificationId, analysis }, 'Analysis completed');

    // Update with results
    logger.info({ verificationId }, 'Step 4: Updating verification with results');
    await storage.updateVerification(verificationId, {
      status: 'completed',
      originalityScore: analysis.originality,
      plagiarismRisk: analysis.plagiarism,
      deepfakeConfidence: analysis.deepfake,
      sentiment: analysis.sentiment,
      rawResult: {
        summary: analysis.summary,
        reasoning: analysis.reasoning,
        processedAt: new Date().toISOString(),
      },
    });

    logger.info({ verificationId }, 'Verification completed successfully');
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error,
      verificationId 
    }, 'Verification job failed');

    try {
      await storage.updateVerification(verificationId, {
        status: 'failed',
        rawResult: {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          failedAt: new Date().toISOString(),
        },
      });
    } catch (updateError) {
      logger.error({ updateError, verificationId }, 'Failed to update verification status to failed');
    }

    throw error; // Re-throw to mark job as failed
  }
}

/**
 * Worker to process verification jobs (only if Redis is available)
 */
export const verificationWorker = hasRedis ? new Worker<VerificationJobData>(
  'content-verification',
  processVerification,
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
) : null;

// Worker event handlers (only if Redis is available)
if (verificationWorker) {
  verificationWorker.on('completed', (job) => {
    logger.info({ jobId: job.id }, 'Job completed');
  });

  verificationWorker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, error: err }, 'Job failed');
  });

  verificationWorker.on('error', (err) => {
    logger.error({ error: err }, 'Worker error');
  });
}

if (!hasRedis) {
  logger.warn('⚠️  Redis not configured - running without queue system (jobs will be processed synchronously)');
}

/**
 * Add verification to queue (or process immediately if no Redis)
 */
export async function queueVerification(verificationId: string, url: string) {
  if (hasRedis && verificationQueue) {
    const job = await verificationQueue.add('verify', {
      verificationId,
      url,
    });

    logger.info({ jobId: job.id, verificationId }, 'Verification job queued');
    return job;
  } else {
    // Process immediately without queue
    logger.info({ verificationId }, 'Processing verification synchronously (no Redis)');
    
    // Process in background without blocking
    processVerification({ data: { verificationId, url } } as Job<VerificationJobData>).catch((error) => {
      logger.error({ error, verificationId }, 'Synchronous verification failed');
    });
    
    return { id: verificationId };
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats() {
  if (hasRedis && verificationQueue) {
    const [waiting, active, completed, failed] = await Promise.all([
      verificationQueue.getWaitingCount(),
      verificationQueue.getActiveCount(),
      verificationQueue.getCompletedCount(),
      verificationQueue.getFailedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
    };
  } else {
    return {
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
    };
  }
}

/**
 * Clean up on shutdown
 */
export async function closeQueue() {
  if (hasRedis) {
    if (verificationWorker) await verificationWorker.close();
    if (verificationQueue) await verificationQueue.close();
    logger.info('Queue system closed');
  }
}
