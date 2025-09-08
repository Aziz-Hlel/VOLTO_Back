import { Module } from '@nestjs/common';
import { SpinnigWheelRewardService } from './spinnig-wheel-reward.service';
import { SpinnigWheelRewardController } from './spinnig-wheel-reward.controller';
import { SpinnigWheelService } from 'src/spinnig-wheel/spinnig-wheel.service';

@Module({
  imports: [SpinnigWheelService],
  controllers: [SpinnigWheelRewardController],
  providers: [SpinnigWheelRewardService],
})
export class SpinnigWheelRewardModule { }
