import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSpinnigWheelRewardDto {
  @IsString()
  @MaxLength(15)
  @MinLength(2)
  name: string;
}
