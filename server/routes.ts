import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { queueVerification, getQueueStats } from "./services/queue";
import { logger } from "./services/logger";
import { authenticateToken, type AuthRequest } from "./middleware/auth";
import { getAuth } from "./firebase";

// Routes now use queue system for async processing
// See server/services/queue.ts for implementation

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post('/api/auth/verify', async (req: AuthRequest, res) => {
    try {
      const { idToken } = req.body;
      
      if (!idToken) {
        return res.status(400).json({ message: 'ID token is required' });
      }

      const decodedToken = await getAuth().verifyIdToken(idToken);
      
      res.json({
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
      });
    } catch (error) {
      logger.error({ error }, 'Token verification failed');
      res.status(401).json({ message: 'Invalid token' });
    }
  });

  app.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res) => {
    res.json(req.user);
  });
  
  app.get(api.verifications.list.path, authenticateToken, async (req: AuthRequest, res) => {
    // Get only the authenticated user's verifications
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const verifications = await storage.getUserVerifications(userId);
    res.json(verifications);
  });

  app.get(api.verifications.get.path, authenticateToken, async (req: AuthRequest, res) => {
    const verification = await storage.getVerification(req.params.id);
    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }
    
    // Verify user owns this verification
    const userId = req.user?.uid;
    if (verification.userId && verification.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(verification);
  });

  app.post(api.verifications.create.path, authenticateToken, async (req: AuthRequest, res) => {
    try {
      const input = api.verifications.create.input.parse(req.body);
      const userId = req.user?.uid;
      
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      
      logger.info({ url: input.url, userId }, 'Creating new verification');
      
      // 1. Create initial record with userId
      const verification = await storage.createVerification({
        ...input,
        userId,
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

  // Service status endpoint for debugging
  app.get('/api/status', async (_req, res) => {
    try {
      const { genLayerService } = await import('./services/genlayer');
      const status = genLayerService.getStatus();
      res.json(status);
    } catch (error) {
      logger.error({ error }, 'Error getting service status');
      res.status(500).json({ message: 'Failed to get service status' });
    }
  });

  return httpServer;
}
