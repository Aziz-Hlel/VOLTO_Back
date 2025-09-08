import { Module } from '@nestjs/common';
import { SpinnigWheelService } from './spinnig-wheel.service';
import { SpinnigWheelController } from './spinnig-wheel.controller';

@Module({
  controllers: [SpinnigWheelController],
  providers: [SpinnigWheelService],
  exports: [SpinnigWheelService]
})
export class SpinnigWheelModule {}
