import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { MinioStorage } from './minioStorage.service';
import { AwsS3Storage } from './awsS3Storage.service';
import StorageStrategyPatternProvider from './StorageStrategyPatternProvider';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [StorageController],
  providers: [StorageStrategyPatternProvider, StorageService],
  exports: [StorageService],
})
export class StorageModule {}
