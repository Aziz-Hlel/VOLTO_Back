import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { IStorageProvider } from './interfaces/storage.interface';
import ENV from 'src/config/env';
import { GeneratePresignedUrlParams } from './types/generatePresignedUrlParams';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MinioStorage implements IStorageProvider {
  constructor() {
    // if (ENV.NODE_ENV !== 'development')
    //     throw new Error('MinioStorageService can only be used in development environment');
  }

  readonly s3Client = new S3Client({
    region: ENV.MINIO_Region!,
    endpoint: `http://localhost:${ENV.MINIO_PORT!}/`,
    credentials: {
      accessKeyId: ENV.MINIO_ACCESS_KEY!,
      secretAccessKey: ENV.MINIO_SECRET_KEY!,
    },
    forcePathStyle: true,
  });

  async generatePresignedUrl({
    fileKey,
    mimeType,
    expiresIn,
  }: GeneratePresignedUrlParams): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: ENV.MINIO_BUCKET!,
      Key: fileKey,
      ContentType: mimeType,
      // ContentDisposition: 'attachment', // Security: prevent content-type switching
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });

    return signedUrl;
  }
}
