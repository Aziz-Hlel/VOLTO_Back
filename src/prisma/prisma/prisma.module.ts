import { Global, Module } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Global()
@Module({
  providers: [
    {
      provide: 'PRISMA_SERVICE',
      useValue: new PrismaClient(),
    },
  ],
  exports: ['PRISMA_SERVICE'],
})
export class PrismaModule {}
