// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'stage', 'production']),
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
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import in every module
      envFilePath: '.env',
    }),
  ],
})
export class AppConfigModule {}
