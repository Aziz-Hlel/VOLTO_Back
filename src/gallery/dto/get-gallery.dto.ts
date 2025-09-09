import { GalleryTags } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class GetGalleryDto {

      @Type(() => Number)
  @IsNumber()
  @IsPositive()
  page: number;

    @Type(() => Number)
  @IsNumber()
  @IsPositive()
  limit: number;

  @IsOptional()
  @IsEnum(GalleryTags)
  tag: GalleryTags;
}
