import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaClient } from 'generated/prisma';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {

  constructor(private prisma: PrismaService, private readonly mediaService: MediaService) { }


  create(createEventDto: CreateEventDto) {
    return 'This action adds a new event';
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
