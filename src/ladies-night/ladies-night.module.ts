import { Module } from '@nestjs/common';
import { LadiesNightGateway } from './ladies-night.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { LadiesNightService } from './ladies-night.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LadiesNightController } from './ladies-night.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LadiesNightController],
  providers: [LadiesNightGateway, LadiesNightService],
  exports: [LadiesNightService],
})
export class LadiesNightModule {}
