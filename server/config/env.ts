import { z } from 'zod';

// Simplified environment variable schema - works with Vercel and local .env
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().positive()).default('5000'),
  
  // Firebase (required for production)
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT: z.string().optional(), // JSON string of service account
  
  // GenLayer Intelligent Contract (REQUIRED - this is the primary method)
  GENLAYER_CONTRACT_ADDRESS: z.string().optional(),
  GENLAYER_RPC_URL: z.string().default('https://studio.genlayer.com:8000'),
  GENLAYER_PRIVATE_KEY: z.string().optional(),
  
  // AI Fallback (optional - used if GenLayer contract not configured)
  GEMINI_API_KEY: z.string().optional(),
  
  // Queue System (optional - uses in-memory if not provided)
  REDIS_URL: z.string().optional(),
  
  // Security (uses defaults if not provided)
  SESSION_SECRET: z.string().default('dev-secret-change-in-production-min-32-characters-long'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().positive()).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().positive()).default('100'),
  
  // CORS
  CORS_ORIGIN: z.string().default('*'),  // Permissive for development, override in production
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
  
  // Production warnings
  if (env.NODE_ENV === 'production') {
    if (!env.FIREBASE_PROJECT_ID) {
      console.warn('⚠️  WARNING: FIREBASE_PROJECT_ID not set - using in-memory storage (data will be lost on restart)');
    }
    if (!env.GENLAYER_CONTRACT_ADDRESS) {
      console.warn('⚠️  WARNING: GENLAYER_CONTRACT_ADDRESS not set - intelligent contract verification disabled');
    }
    if (env.SESSION_SECRET.includes('dev-secret')) {
      console.warn('⚠️  WARNING: Using development SESSION_SECRET in production');
    }
  }
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment variable validation failed:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export { env };

// Helper to check if we're in production
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
