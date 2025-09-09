import { IsString } from 'class-validator';

export class CreateSpinnigWheelRewardDto {
  @IsString()
  name: string;
}
