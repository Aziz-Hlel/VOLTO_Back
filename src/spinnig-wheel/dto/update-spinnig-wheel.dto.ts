import { PartialType } from '@nestjs/mapped-types';
import { CreateSpinnigWheelDto } from './create-spinnig-wheel.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSpinnigWheelDto {

    @IsString()
    id: string;

    @IsOptional()
    @IsString()
    name: string;

    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @Type(() => Date)
    @IsDate()
    endDate: Date;

    
}
