import { Gender, Role } from "generated/prisma";


export class UserResponseDto {
  id: number;
  email: string;
  gender: Gender;
  phoneNumber?: string;
  username: string;
  role: Role;
}