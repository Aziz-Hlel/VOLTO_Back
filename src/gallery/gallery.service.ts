/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetGalleryDto } from './dto/get-gallery.dto';
import { EntityType, MediaPurpose } from '@prisma/client';

@Injectable()
export class GalleryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  create = async (createGalleryDto: CreateGalleryDto) => {
    try {
      const createdGallery = await this.prisma.gallery.create({
        data: {
          tag: createGalleryDto.tag,
        },
      });
        
      await this.mediaService.confirmPendingMedia(
        createGalleryDto.s3Key,
        createdGallery.id,
      );

      return createdGallery;

    } catch (e) {
      console.log(e);
    }
  };

 async findAll(query: GetGalleryDto) {

  const galleries =  this.prisma.gallery.findMany({
      where: {
        tag: query.tag,
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy:{
        createdAt:'desc'
      },

    });
    const total =  this.prisma.gallery.count({
      where: {
        tag: query.tag,
      },
    });

    const [response,count]= await this.prisma.$transaction([galleries,total]);



    const galleryWithMedia = response.map(async (gallery) => {
      const thumbnail = await this.mediaService.getMediaKeyAndUrl({
        entityType: EntityType.GALLERY,
        entityId: gallery.id,
        mediaPurpose: MediaPurpose.IMAGE,
      });

      return { ...gallery, thumbnail };
    });
    
    const galleriesWithMedia = await Promise.all(galleryWithMedia);

    return {
      payload : galleriesWithMedia,
      count
    }
  }

  async findOne(id: string) {
    const gallery =await this.prisma.gallery.findUnique({
      where: {
        id,
      },
    })

    if(!gallery) throw new NotFoundException(`Gallery with ID ${id} not found`);
  
  const thumbnail = await this.mediaService.getMediaKeyAndUrl({
    entityType: EntityType.GALLERY,
    entityId: gallery.id,
    mediaPurpose: MediaPurpose.IMAGE,
  });

  return { ...gallery, thumbnail };

  }

  update(id: number, updateGalleryDto: UpdateGalleryDto) {
    return `This action updates a #${id} gallery`;
  }

  remove(id: number) {
    return `This action removes a #${id} gallery`;
  }
}
