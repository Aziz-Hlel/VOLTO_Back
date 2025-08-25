import { IsPositive, IsString, Max, MinLength } from "class-validator";
import { EntityType } from "generated/prisma";

export class PreSignedUrlDto {

    static oneMb = 1024 * 1024;

    @IsString()
    @MinLength(2)
    mimeType: string;

    @IsPositive()
    @Max(10 * PreSignedUrlDto.oneMb) // 10 MB
    size: number;

    @IsString()
    @MinLength(1)
    originalName: string;


    entityType: EntityType;

    mediaPurpose?: string;

}