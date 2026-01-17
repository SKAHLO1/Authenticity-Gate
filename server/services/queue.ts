import { Queue, Worker, Job } from 'bullmq';
import { env } from '../config/env';
import { logger } from './logger';
import { storage } from '../storage';
import * as cheerio from 'cheerio';
import { genLayerService } from './genlayer';

/**
 * Queue configuration
 */
const connection = env.REDIS_URL
  ? { url: env.REDIS_URL }
  : undefined; // Will use in-memory if Redis not available

interface VerificationJobData {
  verificationId: number;
  url: string;
}

/**
 * Content verification queue
 */
export const verificationQueue = new Queue<VerificationJobData>('content-verification', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
      age: 24 * 3600, // Keep for 24 hours
    },
    removeOnFail: {
      count: 500, // Keep last 500 failed jobs
    },
  },
});

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
    await storage.updateVerification(verificationId, {
      status: 'processing',
    });

    // Fetch content
    const textContent = await fetchUrlContent(url);

    // Analyze with GenLayer/Gemini
    const analysis = await genLayerService.verifyContent(textContent);

    // Update with results
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
    logger.error({ error, verificationId }, 'Verification job failed');

    await storage.updateVerification(verificationId, {
      status: 'failed',
      rawResult: {
        error: error instanceof Error ? error.message : 'Unknown error',
        failedAt: new Date().toISOString(),
      },
    });

    throw error; // Re-throw to mark job as failed
  }
}

/**
 * Worker to process verification jobs
 */
export const verificationWorker = new Worker<VerificationJobData>(
  'content-verification',
  processVerification,
  {
    connection,
    concurrency: 5, // Process up to 5 jobs concurrently
    limiter: {
      max: 10, // Max 10 jobs per duration
      duration: 1000, // Per second
    },
  }
);

// Worker event handlers
verificationWorker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Job completed');
});

verificationWorker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, error: err }, 'Job failed');
});

verificationWorker.on('error', (err) => {
  logger.error({ error: err }, 'Worker error');
});

/**
 * Add verification to queue
 */
export async function queueVerification(verificationId: number, url: string) {
  const job = await verificationQueue.add('verify', {
    verificationId,
    url,
  });

  logger.info({ jobId: job.id, verificationId }, 'Verification job queued');

  return job;
}

/**
 * Get queue statistics
 */
export async function getQueueStats() {
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
}

/**
 * Clean up on shutdown
 */
export async function closeQueue() {
  await verificationWorker.close();
  await verificationQueue.close();
  logger.info('Queue system closed');
}
