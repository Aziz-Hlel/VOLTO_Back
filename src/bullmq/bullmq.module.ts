import { Module } from '@nestjs/common';
import { BullmqService } from './bullmq.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LadiesNightModule } from 'src/ladies-night/ladies-night.module';
import { BullmqService2 } from './bullmq2.service';

@Module({
  imports: [PrismaModule, LadiesNightModule],
  providers: [BullmqService2],
})
export class BullmqModule {}
