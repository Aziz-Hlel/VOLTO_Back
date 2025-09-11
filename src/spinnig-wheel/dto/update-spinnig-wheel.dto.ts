import { PartialType } from '@nestjs/mapped-types';
import { CreateSpinnigWheel } from './create-spinnig-wheel.dto';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateSignleSpinnigWheelRewardDto } from 'src/spinnig-wheel-reward/dto/update-spinnig-wheel-reward.dto';

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


  @IsArray()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => UpdateSignleSpinnigWheelRewardDto)
  rewardList: UpdateSignleSpinnigWheelRewardDto[];

}
