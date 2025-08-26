import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Media, MediaStatus, PrismaClient } from 'generated/prisma';
import { MediaIdentifier } from './types/MediaIndetifier';
import { PrismaService } from 'src/prisma/prisma.service';
import { PreSignedUrlRequest } from 'src/storage/dto/preSignedUrl.dto';

@Injectable()
export class MediaService {

  constructor(private prisma: PrismaService) { }


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

  async confirmPendingMedia(s3Key: string, entityId: string) {
    const media = await this.prisma.media.findFirst({
      where: {
        s3Key,
        status: 'PENDING',
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
    ;

    return media;
  };
  


  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
