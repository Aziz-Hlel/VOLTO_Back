
// src/config/env.ts
import { ConfigService } from '@nestjs/config';
import z from 'zod';
import { envSchema } from './config.module';


const validatedEnv = envSchema.safeParse(process.env);
if (!validatedEnv.success) throw new Error(validatedEnv.error.message);
const ENV = validatedEnv.data;

export default ENV;