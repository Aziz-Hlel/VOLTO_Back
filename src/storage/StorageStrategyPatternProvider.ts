import ENV from 'src/config/env';
import { IStorageProvider } from './interfaces/storage.interface';
import { MinioStorage } from './minioStorage.service';
import { AwsS3Storage } from './awsS3Storage.service';

const StorageStrategyPatternProvider = {
  provide: 'STORAGE_SERVICE',
  useFactory: (): IStorageProvider => {
    if (ENV.NODE_ENV === 'development') {
      return new MinioStorage();
    }
    return new AwsS3Storage();
  },
};

export default StorageStrategyPatternProvider;
