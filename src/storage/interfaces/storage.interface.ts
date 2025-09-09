import { S3Client } from '@aws-sdk/client-s3';
import { GeneratePresignedUrlParams } from '../types/generatePresignedUrlParams';

export interface IStorageProvider {
  s3Client: S3Client;

  generatePresignedUrl(params: GeneratePresignedUrlParams): Promise<string>;
}
