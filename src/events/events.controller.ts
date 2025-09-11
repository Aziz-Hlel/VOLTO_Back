import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventType, Role } from '@prisma/client';
import { JwtAccessGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetAllEventsDto } from './dto/get-all-events';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    if (
      createEventDto.type === EventType.SPECIAL &&
      (!createEventDto.startDate || !createEventDto.endDate)
    )
      throw new BadRequestException(
        'startDate and endDate are required for special events',
      );

    if (
      createEventDto.type === EventType.WEEKLY &&
      (!createEventDto.cronStartDate || !createEventDto.cronEndDate)
    )
      throw new BadRequestException(
        'cronStartDate and cronEndDate are required for weekly events',
      );

    const createdEvent = await this.eventsService.create(createEventDto);

    return createdEvent;
  }

  @Get()
  findAll(@Query() query: GetAllEventsDto) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.getById(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    console.log('')
    if (
      updateEventDto.type === EventType.SPECIAL &&
      (!updateEventDto.startDate || !updateEventDto.endDate)
    )
      throw new BadRequestException(
        'startDate and endDate are required for special events',
      );

    if (
      updateEventDto.type === EventType.WEEKLY &&
      (!updateEventDto.cronStartDate || !updateEventDto.cronEndDate)
    )
      throw new BadRequestException(
        'cronStartDate and cronEndDate are required for weekly events',
      );
try{
  return await this.eventsService.update(updateEventDto);

}catch(e){
  console.log(e);
}
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
