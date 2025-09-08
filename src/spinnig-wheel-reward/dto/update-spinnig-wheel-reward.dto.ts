import { PartialType } from '@nestjs/mapped-types';
import { CreateSpinnigWheelRewardDto } from './create-spinnig-wheel-reward.dto';
import { IsString } from 'class-validator';

export class UpdateSpinnigWheelRewardDto extends PartialType(CreateSpinnigWheelRewardDto) {
    @IsString()
    id: string
}
