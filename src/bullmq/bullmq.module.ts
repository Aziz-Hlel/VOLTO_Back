import { Module } from '@nestjs/common';
import { BullmqService } from './bullmq.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BullmqService]
})
export class BullmqModule { }
