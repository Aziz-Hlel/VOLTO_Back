import ENV from 'src/config/env';
import { AwsS3Storage } from './awsS3Storage.service';
import { IStorageProvider } from './interfaces/storage.interface';
import { MinioStorage } from './minioStorage.service';

export function createStorageProvider(): IStorageProvider {
  if (ENV.NODE_ENV === 'development' || ENV.NODE_ENV === 'test') {
    return new MinioStorage();
  }

  return new MinioStorage();
  throw new Error(`Unsupported StorageProvider for NODE_ENV: ${ENV.NODE_ENV}`);
}
