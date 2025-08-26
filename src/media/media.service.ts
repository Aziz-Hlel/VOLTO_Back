import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Media, MediaStatus, PrismaClient } from 'generated/prisma';
import { MediaIdentifier } from './types/MediaIndetifier';
import { PrismaService } from 'src/prisma/prisma.service';
import { PreSignedUrlRequest } from 'src/storage/dto/preSignedUrl.dto';
import { StorageService } from 'src/storage/storage.service';
import path from 'path';
import { StorageMapper } from 'src/storage/mapper/StorageMapper';

@Injectable()
export class MediaService {

  constructor(private prisma: PrismaService, private readonly storageService: StorageService) { }

  async createPendingMedia(preSignedUrlDto: PreSignedUrlRequest, fileKey: string) {
    const createdMedia = await this.prisma.media.create({
      data: {
        originalName: preSignedUrlDto.originalName,
        s3Key: fileKey,
        entityType: preSignedUrlDto.entityType,
        mimeType: preSignedUrlDto.mimeType,
        entityId: null,
        mediaPurpose: preSignedUrlDto.mediaPurpose || null,
        fileType: preSignedUrlDto.fileType,
        status: MediaStatus.PENDING,
      }
    });

    return createdMedia;
  }

  async getPresignedUrl(preSignedUrlDto: PreSignedUrlRequest) {

    const { signedUrl, fileKey } = await this.storageService.getPresignedUrl(preSignedUrlDto);

    this.createPendingMedia(preSignedUrlDto, fileKey);

    const response = StorageMapper.toPreSignedUrlResponse(signedUrl, fileKey);

    return response;

  }


  async confirmPendingMedia(s3Key: string, entityId: string) {
    const media = await this.prisma.media.findFirst({
      where: {
        s3Key,
        status: MediaStatus.PENDING,
      }
    });

    if (!media)
      throw new NotFoundException(`Media with s3Key ${s3Key} not found`);

    await this.prisma.media.update({
      where: {
        s3Key: media.s3Key,
      },
      data: {
        status: MediaStatus.CONFIRMED,
        entityId,
      }
    });
  }




  findAll() {
    return `This action returns all media`;
  }

  async findOne(identifier: MediaIdentifier): Promise<Media> {
    const media = await this.prisma.media.findFirst({
      where: {
        entityType: identifier.entityType,
        entityId: identifier.entityId,
        mediaPurpose: identifier.mediaPurpose || null,
      }
    });

    if (!media)
      throw new NotFoundException(`Media with purpose ${identifier.mediaPurpose} for ${identifier.entityType} ID ${identifier.entityId} not found`);

    return media;

  };


  async getMediaKeyAndUrl(identifier: MediaIdentifier): Promise<{ s3Key: string, url: string }> {

    const media = await this.findOne(identifier);

    const url = await this.storageService.getObjectUrl(media.s3Key);

    return { s3Key: media.s3Key, url };

  }


  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
