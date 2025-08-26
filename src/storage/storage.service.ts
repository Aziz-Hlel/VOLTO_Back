import { Body, HttpCode, Injectable } from '@nestjs/common';
import { CreateS3Dto } from './dto/create-s3.dto';
import { UpdateS3Dto } from './dto/update-s3.dto';
import { PreSignedUrlRequest } from './dto/preSignedUrl.dto';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import ENV from 'src/config/env';
import path from 'path';
import { StorageMapper } from './mapper/StorageMapper';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class StorageService {

  constructor(public mediaService: MediaService) { }

  private static readonly s3Client = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
      accessKeyId: ENV.AWS_ACCESS_KEY_ID,
      secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
    },

  });


  generateFileKey(fileName: string): string {
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const safeBase = baseName.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 50);
    const timestamp = Date.now();
    return `${safeBase}-${timestamp}${ext}`;
  }



  async getPresignedUrl(preSignedUrlDto: PreSignedUrlRequest) {

    const fileKey = this.generateFileKey(preSignedUrlDto.originalName);
    const fileType = preSignedUrlDto.fileType;
    const expiresIn = 3600;

    const command = new PutObjectCommand({
      Bucket: ENV.AWS_S3_BUCKET,
      Key: fileKey,
      ContentType: fileType,
      ContentDisposition: 'attachment', // Security: prevent content-type switching
    });


    const signedUrl = await getSignedUrl(StorageService.s3Client, command, { expiresIn, });

    this.mediaService.createPendingMedia(preSignedUrlDto, fileKey);

    const response = StorageMapper.toPreSignedUrlResponse(signedUrl, fileKey);

    return response;

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
