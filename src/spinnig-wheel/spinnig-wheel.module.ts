import { Module } from '@nestjs/common';
import { SpinnigWheelService } from './spinnig-wheel.service';
import { SpinnigWheelController } from './spinnig-wheel.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SpinnigWheelController],
  providers: [SpinnigWheelService],
  exports: [SpinnigWheelService]
})
export class SpinnigWheelModule {}
