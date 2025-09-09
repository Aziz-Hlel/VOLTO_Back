import { Module } from '@nestjs/common';
import { SpinnigWheelRewardService } from './spinnig-wheel-reward.service';
import { SpinnigWheelRewardController } from './spinnig-wheel-reward.controller';
import { SpinnigWheelService } from 'src/spinnig-wheel/spinnig-wheel.service';
import { SpinnigWheelModule } from 'src/spinnig-wheel/spinnig-wheel.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, SpinnigWheelModule],
  controllers: [SpinnigWheelRewardController],
  providers: [SpinnigWheelRewardService],
  exports: [SpinnigWheelRewardService],
})
export class SpinnigWheelRewardModule {}
