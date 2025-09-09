import { EventType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class GetAllEventsDto {
  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;
}
