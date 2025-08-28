import { Injectable, } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EntityType, Event } from '@prisma/client';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {

  constructor(private prisma: PrismaService, private readonly mediaService: MediaService) { }


  async create(createEventDto: CreateEventDto) {

    const { thumbnailKey, videoKey, ...eventDto } = createEventDto

    const createdEvent: Event = await this.prisma.event.create({
      data: {
        ...eventDto,
        isLadiesNight: false,
      }
    });

    const confirmThumbnail = this.mediaService.confirmPendingMedia(createEventDto.thumbnailKey, createdEvent.id)
    const confirmVideo = this.mediaService.confirmPendingMedia(createEventDto.videoKey, createdEvent.id)

    await Promise.all([confirmThumbnail, confirmVideo]);

    return createdEvent;

  }

  async getById(id: string) {

    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event)
      throw new Error(`Event with ID ${id} not found`);

    const thumbnail = await this.mediaService.getMediaKeyAndUrl({ entityType: EntityType.EVENT, entityId: event.id, mediaPurpose: 'thumbnail' });

    const video = await this.mediaService.getMediaKeyAndUrl({ entityType: EntityType.EVENT, entityId: event.id, mediaPurpose: 'video' });

    return { ...event, thumbnail, video };

  }

  findAll() {
    return `This action returns all events`;
  }

  // async findOne(id: string) {
  //   const event = await this.prisma.event.findUnique({
  //     where: { id },
  //   });

  //   if (!event)
  //     throw new NotFoundException(`Event with ID ${id} not found`);

  //   const thumbnail = await this.mediaService.findOne({
  //     entityType: 'Event',
  //     entityId: id,
  //     mediaPurpose: 'thumbnail',
  //   });

  //   const video = await this.mediaService.findOne({
  //     entityType: 'Event',
  //     entityId: id,
  //     mediaPurpose: 'video',
  //   });

  //   const eventWithMedia = {
  //     ...event,
  //     thumbnail,
  //     video,
  //   };


  //   return eventWithMedia;
  // }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
