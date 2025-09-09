import { GalleryTags } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  @IsNotEmpty()
  s3Key: string;

  @IsEnum(GalleryTags)
  @IsNotEmpty()
  tag: GalleryTags;
}
