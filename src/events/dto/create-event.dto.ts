import { EventType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateEventDto {

    @IsString()
    name: string;

    @IsEnum(EventType)
    type: EventType;

    @IsOptional()
    @IsString()
    description: string;

    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @Type(() => Date)
    @IsDate()
    endDate: Date;

    @IsString()
    thumbnailKey: string;

    @IsString()
    videoKey: string;

}
