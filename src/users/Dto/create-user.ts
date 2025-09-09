import { Gender, Role } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  username: string;

  @IsString()
  @MinLength(2)
  email: string;

  @IsOptional()
  @Matches(/^[0-9]+$/, { message: 'Phone number must contain only numbers' })
  phoneNumber: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsEnum(Gender, { message: 'Gender must be either M or F' })
  gender: Gender;

  @IsEnum(Role, { message: 'Invalid Role' })
  role: Role;
}
