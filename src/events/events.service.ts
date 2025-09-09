import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EntityType, Event } from '@prisma/client';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';
import Redis from 'ioredis';
import REDIS_KEYS from 'src/redis/redisKeys';
import { HASHES } from 'src/redis/hashes';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private readonly mediaService: MediaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const { thumbnailKey, videoKey, ...eventDto } = createEventDto;

    const createdEvent: Event = await this.prisma.event.create({
      data: {
        ...eventDto,
        isLadiesNight: false,
      },
    });

    const confirmThumbnail = this.mediaService.confirmPendingMedia(
      createEventDto.thumbnailKey,
      createdEvent.id,
    );
    const confirmVideo = this.mediaService.confirmPendingMedia(
      createEventDto.videoKey,
      createdEvent.id,
    );

    await Promise.all([confirmThumbnail, confirmVideo]);

    return createdEvent;
  }

  async getById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) throw new Error(`Event with ID ${id} not found`);

    const thumbnail = await this.mediaService.getMediaKeyAndUrl({
      entityType: EntityType.EVENT,
      entityId: event.id,
      mediaPurpose: 'thumbnail',
    });

    const video = await this.mediaService.getMediaKeyAndUrl({
      entityType: EntityType.EVENT,
      entityId: event.id,
      mediaPurpose: 'video',
    });

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

  update = async (updateEventDto: UpdateEventDto) => {
    // ! not solid when a user updates a media there s lot of bugs , @@unique([entityType, entityId, mediaPurpose]) put in the db will make it crash if you add another media since the new media will have the same values and you need to delete and changes the states of the old media once the new one is confirmed
    const { thumbnailKey, videoKey, ...eventDto } = updateEventDto;

    const existingEvent = await this.getById(updateEventDto.id);

    if (!existingEvent)
      throw new Error(`Event with ID ${updateEventDto.id} not found`);

    if (existingEvent.thumbnail.s3Key !== updateEventDto.thumbnailKey)
      await this.mediaService.confirmPendingMedia(
        updateEventDto.thumbnailKey,
        updateEventDto.id,
      );

    if (existingEvent.video.s3Key !== updateEventDto.videoKey)
      await this.mediaService.confirmPendingMedia(
        updateEventDto.videoKey,
        updateEventDto.id,
      );

    const createdEvent: Event = await this.prisma.event.update({
      where: { id: updateEventDto.id },
      data: {
        ...eventDto,
      },
    });

    if (existingEvent.isLadiesNight) {
      this.redis.hdel(HASHES.LADIES_NIGHT.DATE.HASH());
    }

    return createdEvent;
  };

  remove(id: string) {
    return `This action removes a #${id} event`;
  }
}
