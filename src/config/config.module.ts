// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables available everywhere
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // supports multiple environments
    }),
  ],
})
export class AppConfigModule {}
