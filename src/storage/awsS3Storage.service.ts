import ENV from 'src/config/env';
import { IStorageProvider } from './interfaces/storage.interface';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GeneratePresignedUrlParams } from './types/generatePresignedUrlParams';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Storage implements IStorageProvider {
  constructor() {
    // Initialize AWS S3 client here
    // if (ENV.NODE_ENV !== 'production')
    //     throw new Error('AwsS3StorageService can only be used in production environment');
  }

  readonly s3Client = new S3Client({
    region: ENV.AWS_REGION,
    // credentials: {
      // accessKeyId: ENV.AWS_ACCESS_KEY_ID,
      // secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
    // },
  });

  async generatePresignedUrl({
    fileKey,
    mimeType: fileType,
    expiresIn,
  }: GeneratePresignedUrlParams): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: ENV.AWS_S3_BUCKET,
      Key: fileKey,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });

    return signedUrl;
  }
}
