import { Inject, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EntityType, Event, MediaPurpose } from '@prisma/client';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';
import Redis from 'ioredis';
import { HASHES } from 'src/redis/hashes';
import { GetAllEventsDto } from './dto/get-all-events';

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
      thumbnailKey,
      createdEvent.id,
    );
    const confirmVideo = this.mediaService.confirmPendingMedia(
      videoKey,
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
      mediaPurpose: MediaPurpose.THUMBNAIL,
    });

    const video = await this.mediaService.getMediaKeyAndUrl({
      entityType: EntityType.EVENT,
      entityId: event.id,
      mediaPurpose: MediaPurpose.VIDEO,
    });

    return { ...event, thumbnail, video };
  }

  async findAll(query: GetAllEventsDto) {
    const events = await this.prisma.event.findMany({
      where: {
        type: query.eventType,
      },
    });

    const eventWithMedia = events.map(async (event) => {
      const thumbnail = await this.mediaService.getMediaKeyAndUrl({
        entityType: EntityType.EVENT,
        entityId: event.id,
        mediaPurpose: MediaPurpose.THUMBNAIL,
      });

      const video = await this.mediaService.getMediaKeyAndUrl({
        entityType: EntityType.EVENT,
        entityId: event.id,
        mediaPurpose: MediaPurpose.VIDEO,
      });

      return { ...event, thumbnail, video };
    });

    return Promise.all(eventWithMedia);
  }

  update = async (updateEventDto: UpdateEventDto) => {
    // ! not solid when a user updates a media there s lot of bugs , @@unique([entityType, entityId, mediaPurpose]) put in the db will make it crash if you add another media since the new media will have the same values and you need to delete and changes the states of the old media once the new one is confirmed
    const { thumbnailKey, videoKey, ...eventDto } = updateEventDto;

    const existingEvent = await this.getById(updateEventDto.id);

    if (!existingEvent)
      throw new Error(`Event with ID ${updateEventDto.id} not found`);


    
    if (existingEvent.thumbnail.s3Key !== thumbnailKey){

      await this.mediaService.confirmPendingMedia(
        thumbnailKey,
        updateEventDto.id,
      );

    }
    if (existingEvent.video.s3Key !== videoKey){

      await this.mediaService.confirmPendingMedia(
        updateEventDto.videoKey,
        updateEventDto.id,
      );

    }
    const updatedEvent: Event = await this.prisma.event.update({
      where: { id: updateEventDto.id },
      data: {
        ...eventDto,
      },
    });

    if (existingEvent.isLadiesNight) {
      await this.redis.del(HASHES.LADIES_NIGHT.DATE.HASH());
    }

    if (existingEvent.isLadiesNight &&( existingEvent.cronStartDate !== updatedEvent.cronStartDate || existingEvent.cronEndDate !== updatedEvent.cronEndDate)) {
     await this.deleteUserHashes();
    }

    return updatedEvent;
  };


    async deleteUserHashes() {
      const pattern = HASHES.LADIES_NIGHT.USER.ALL_HASH();
      let cursor = '0';
      
      do {
        const [newCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = newCursor;

        if (keys.length > 0) {
          await this.redis.del(...keys); // delete all found keys
        }
      } while (cursor !== '0');

    } 

  remove(id: string) {
    return `This action removes a #${id} event`;
  }
}
