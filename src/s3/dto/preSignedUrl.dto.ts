import { IsEnum, IsPositive, IsString, Max, MinLength } from "class-validator";
import { EntityType } from "generated/prisma";

const FileType = {
    JPG: '.jpg',
    JPEG: '.jpeg',
    PNG: '.png',
    MP4: '.mp4',
    MOV: '.mov',
    AVI: '.avi',
    GIF: '.gif',
} as const;

export class PreSignedUrlRequest {

    static oneMb = 1024 * 1024;

    @IsString()
    @MinLength(2)
    mimeType: string;

    @IsPositive()
    @Max(10 * PreSignedUrlRequest.oneMb) // 10 MB
    fileSize: number;


    @IsEnum(FileType, { message: 'fileType must be one of .jpg, .jpeg, .png, .mp4, .mov, .avi, .gif' })
    fileType: '.jpg' | '.jpeg' | '.png' | '.mp4' | '.mov' | '.avi' | '.gif';

    @IsString()
    @MinLength(1)
    originalName: string;

    @IsEnum(EntityType, { message: `entityType must be one of ${Object.values(EntityType).join(', ')}` })
    entityType: EntityType;


    mediaPurpose?: string;

}