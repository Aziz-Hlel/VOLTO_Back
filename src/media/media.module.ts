import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [PrismaModule],
  providers: [MediaService,StorageService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule { }
