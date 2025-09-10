import { Body, HttpCode, Inject, Injectable } from '@nestjs/common';
import { CreateS3Dto } from './dto/create-s3.dto';
import { UpdateS3Dto } from './dto/update-s3.dto';
import { PreSignedUrlRequest } from './dto/preSignedUrl.dto';

import ENV from 'src/config/env';
import path from 'path';
import type { IStorageProvider } from './interfaces/storage.interface';
import { EntityType } from '@prisma/client';

@Injectable()
export class StorageService {
  constructor(
    @Inject('STORAGE_SERVICE')
    private readonly storageService: IStorageProvider,
  ) {}

  generateFileKey(fileName: string, entityType: EntityType): string {
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const safeBase = baseName.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50);
    const timestamp = Date.now();
    return `${entityType}/${safeBase}-${timestamp}${ext}`;
  }

  async getPresignedUrl(preSignedUrlDto: PreSignedUrlRequest) {
    const fileKey = this.generateFileKey(preSignedUrlDto.originalName,preSignedUrlDto.entityType);
    const mimeType = preSignedUrlDto.mimeType;
    const expiresIn = 3600;

    const signedUrl = await this.storageService.generatePresignedUrl({
      fileKey,
      mimeType,
      expiresIn,
    });

    return { signedUrl, fileKey };
  }

  async getObjectUrl(fileKey: string): Promise<string> {
    let objectUrl = '';
    if (ENV.NODE_ENV === 'development' || ENV.NODE_ENV === 'test') {
      objectUrl = `http://localhost:${ENV.MINIO_PORT}/${ENV.MINIO_BUCKET}/${fileKey}`;
    } else
      objectUrl = `https://${ENV.AWS_CLOUDFRONT_URL}/${fileKey}`;

    return objectUrl;
  }

  create(createS3Dto: CreateS3Dto) {
    return 'This action adds a new s3';
  }

  findAll() {
    return `This action returns all s3`;
  }

  findOne(id: number) {
    return `This action returns a #${id} s3`;
  }

  update(id: number, updateS3Dto: UpdateS3Dto) {
    return `This action updates a #${id} s3`;
  }

  remove(id: number) {
    return `This action removes a #${id} s3`;
  }
}
