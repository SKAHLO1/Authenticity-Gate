import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { queueVerification, getQueueStats } from "./services/queue";
import { logger } from "./services/logger";

// Routes now use queue system for async processing
// See server/services/queue.ts for implementation

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.verifications.list.path, async (req, res) => {
    const verifications = await storage.getVerifications();
    res.json(verifications);
  });

  app.get(api.verifications.get.path, async (req, res) => {
    const verification = await storage.getVerification(Number(req.params.id));
    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }
    res.json(verification);
  });

  app.post(api.verifications.create.path, async (req, res) => {
    try {
      const input = api.verifications.create.input.parse(req.body);
      
      logger.info({ url: input.url }, 'Creating new verification');
      
      // 1. Create initial record
      const verification = await storage.createVerification({
        ...input,
        status: "pending",
        rawResult: {}
      });
      
      // 2. Queue for async processing using BullMQ
      await queueVerification(verification.id, input.url);

      res.status(201).json(verification);
    } catch (err) {
      if (err instanceof z.ZodError) {
        logger.warn({ errors: err.errors }, 'Validation error');
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      logger.error({ error: err }, 'Error creating verification');
      throw err;
    }
  });

  // Queue stats endpoint for monitoring
  app.get('/api/queue/stats', async (_req, res) => {
    try {
      const stats = await getQueueStats();
      res.json(stats);
    } catch (error) {
      logger.error({ error }, 'Error getting queue stats');
      res.status(500).json({ message: 'Failed to get queue stats' });
    }
  });

  return httpServer;
}
