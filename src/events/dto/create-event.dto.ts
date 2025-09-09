import { EventType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  name: string;

  @IsEnum(EventType)
  type: EventType;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsString()
  @Matches(
    /^(\*|[0-5]?\d) (\*|[0-2]?\d) (\*|[1-3]?\d) (\*|[1-12]) (\*|[0-6])$/,
    {
      message: 'cronStartDate must be a valid cron expression',
    },
  )
  cronStartDate?: string;

  @IsOptional()
  @IsString()
  @Matches(
    /^(\*|[0-5]?\d) (\*|[0-2]?\d) (\*|[1-3]?\d) (\*|[1-12]) (\*|[0-6])$/,
    {
      message: 'cronStartDate must be a valid cron expression',
    },
  )
  cronEndDate?: string;

  @IsString()
  thumbnailKey: string;

  @IsString()
  videoKey: string;
}
