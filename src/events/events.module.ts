import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [PrismaModule, AuthModule, MediaModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
