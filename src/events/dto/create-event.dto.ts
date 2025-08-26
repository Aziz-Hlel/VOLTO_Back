import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { EventType } from "generated/prisma";

export class CreateEventDto {

    @IsString()
    name: string;

    @IsEnum(EventType)
    type: EventType;

    @IsOptional()
    @IsString()
    description: string;

    @IsDate()
    startDate: Date;

    @IsDate()
    endDate: Date;

    @IsString()
    thumbnailKey: string;

    @IsString()
    videoKey: string;

}
