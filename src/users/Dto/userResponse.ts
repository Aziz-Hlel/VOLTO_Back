import { Gender, Role, Tier } from "generated/prisma";


export class UserResponseDto {
  id: string;
  email: string;
  gender: Gender;
  phoneNumber?: string;
  username: string;
  role: Role;
  tier:Tier;
}