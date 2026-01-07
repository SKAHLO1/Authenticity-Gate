import { z } from 'zod';
import { insertVerificationSchema, verifications } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  verifications: {
    create: {
      method: 'POST' as const,
      path: '/api/verifications',
      input: insertVerificationSchema,
      responses: {
        201: z.custom<typeof verifications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/verifications',
      responses: {
        200: z.array(z.custom<typeof verifications.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/verifications/:id',
      responses: {
        200: z.custom<typeof verifications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type CreateVerificationInput = z.infer<typeof api.verifications.create.input>;
