import { forwardRef, Module } from '@nestjs/common';
import { SpinnigWheelService } from './spinnig-wheel.service';
import { SpinnigWheelController } from './spinnig-wheel.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SpinnigWheelRewardModule } from 'src/spinnig-wheel-reward/spinnig-wheel-reward.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => SpinnigWheelRewardModule) // Keep forwardRef here too
  ],
  controllers: [SpinnigWheelController],
  providers: [SpinnigWheelService],
  exports: [SpinnigWheelService],
})
export class SpinnigWheelModule {}