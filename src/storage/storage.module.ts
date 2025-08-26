import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { MediaService } from 'src/media/media.service';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [StorageController],
  providers: [StorageService],

})
export class StorageModule { }
