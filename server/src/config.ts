import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1),
  DRIVER_WHATSAPP: z.string().min(8).default('55XXXXXXXXXXX'),
  ADMIN_TOKEN: z.string().min(12).default('change-this-admin-token'),
  GOOGLE_MAPS_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
export const isProduction = env.NODE_ENV === 'production';
