import { IsInt, IsOptional, IsPositive, IsString, Max, MaxLength, MinLength } from "class-validator";
import { Gender } from "generated/prisma";


export class CreateUserDto {

    @IsString()
    @MinLength(2)
    username: string;

    @IsString()
    @MinLength(2)
    email: string;

    @IsOptional()
    phoneNumber: string;
    
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;
    
    @IsString() 
    gender: Gender; 

    @IsString()
    @MinLength(2)
    occupation: string;

}
