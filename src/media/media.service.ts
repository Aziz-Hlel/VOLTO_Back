import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Media, PrismaClient } from 'generated/prisma';
import { MediaIdentifier } from './types/MediaIndetifier';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediaService {

  constructor(private prisma: PrismaService) { }


  create(createMediaDto: CreateMediaDto) {
    return 'This action adds a new media';
  }

  findAll() {
    return `This action returns all media`;
  }

  // async findOne(identifier: MediaIdentifier): Promise<Media | null> {
  //   const media = await this.prisma.media.findFirst({
  //     where: {
  //       entityType: identifier.entityType,
  //       entityId: identifier.entityId,
  //       mediaPurpose: identifier.mediaPurpose || null,
  //     }
  //   });

  //   if (!media)
  //     throw new NotFoundException(`Media with purpose ${identifier.mediaPurpose} for ${identifier.entityType} ID ${identifier.entityId} not found`);
  //   ;

  //   return media;
  // };

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
