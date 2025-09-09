import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import ENV from 'src/config/env';

@Global() // makes it available everywhere
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: ENV.REDIS_HOST,
          port: ENV.REDIS_PORT,
          maxRetriesPerRequest: null,
        });
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
