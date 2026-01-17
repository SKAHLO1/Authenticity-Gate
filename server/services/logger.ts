import pino from 'pino';
import { env, isProduction } from '../config/env';

/**
 * Production-ready logger using Pino
 * Provides structured logging with appropriate levels
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Request logger middleware
 */
export function createRequestLogger() {
  return (req: any, res: any, next: any) => {
    const start = Date.now();
    const path = req.path;

    res.on('finish', () => {
      const duration = Date.now() - start;
      const logData = {
        method: req.method,
        path,
        statusCode: res.statusCode,
        duration,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      };

      if (res.statusCode >= 500) {
        logger.error(logData, 'Request completed with server error');
      } else if (res.statusCode >= 400) {
        logger.warn(logData, 'Request completed with client error');
      } else {
        logger.info(logData, 'Request completed');
      }
    });

    next();
  };
}

/**
 * Error logger
 */
export function logError(error: Error, context?: Record<string, any>) {
  logger.error(
    {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      ...context,
    },
    'An error occurred'
  );
}
