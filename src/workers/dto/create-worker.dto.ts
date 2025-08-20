import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  occupation: string;

  @IsInt()
  @IsPositive()
  ranking: number;
}
