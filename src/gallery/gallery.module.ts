import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { MediaModule } from 'src/media/media.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, MediaModule],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
