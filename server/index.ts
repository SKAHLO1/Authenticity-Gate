// Load environment variables FIRST before any other imports
import 'dotenv/config';
import { config } from 'dotenv';
import { resolve, join } from 'path';
import { existsSync } from 'fs';

// In production (CommonJS build), just use process.cwd()
// In development (ES modules), we don't need this complex path resolution
const envPath = resolve(process.cwd(), '.env.local');

if (existsSync(envPath)) {
  const result = config({ path: envPath, override: true });
  if (!result.error) {
    console.log('✓ Loaded environment from:', envPath);
  }
} else {
  console.log('ℹ No .env.local file found, using system environment variables');
}

console.log('Environment check:');
console.log('  GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing');
console.log('  GENLAYER_CONTRACT_ADDRESS:', process.env.GENLAYER_CONTRACT_ADDRESS ? '✓ Set' : '✗ Missing');
console.log('  FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing');

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { env, isProduction } from "./config/env";
import { logger, createRequestLogger } from "./services/logger";
import { closeQueue } from "./services/queue";

const app = express();
const httpServer = createServer(app);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: isProduction ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: [
        "'self'",
        "https://identitytoolkit.googleapis.com",
        "https://securetoken.googleapis.com",
        "https://*.firebaseio.com",
        "https://*.googleapis.com",
      ],
      frameSrc: ["'self'", "https://accounts.google.com", "https://authentication-gate.firebaseapp.com"],
    },
  } : false,
}));

// CORS
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Request logging
app.use(createRequestLogger());

export function log(message: string, source = "express") {
  logger.info({ source }, message);
}

(async () => {
  await registerRoutes(httpServer, app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    logger.error({
      error: {
        message: err.message,
        stack: err.stack,
        status,
      },
    }, 'Unhandled error');

    res.status(status).json({ 
      message: isProduction ? 'Internal Server Error' : message,
      ...(isProduction ? {} : { stack: err.stack }),
    });
  });

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    logger.info({ port, env: env.NODE_ENV }, 'Server started successfully');
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutdown signal received');
    
    httpServer.close(async () => {
      logger.info('HTTP server closed');
      
      try {
        await closeQueue();
        logger.info('Graceful shutdown complete');
        process.exit(0);
      } catch (error) {
        logger.error({ error }, 'Error during shutdown');
        process.exit(1);
      }
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
})();
