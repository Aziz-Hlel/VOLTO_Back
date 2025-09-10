// src/config/env.ts
import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'stage', 'production', 'test']),
  PORT: z.coerce.number(),

  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),

  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string(),

  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_BUCKET: z.string(),
  AWS_CLOUDFRONT_URL: z.string(),

  MINIO_Region: z.string().optional(),
  MINIO_ACCESS_KEY: z.string().optional(),
  MINIO_SECRET_KEY: z.string().optional(),
  MINIO_BUCKET: z.string().optional(),
  MINIO_ENDPOINT: z.string().optional(),
  MINIO_PORT: z.coerce.number().optional(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
});

const validatedEnv = envSchema.safeParse(process.env);
if (!validatedEnv.success) throw new Error(validatedEnv.error.message);

const ENV = validatedEnv.data;

export default ENV;
