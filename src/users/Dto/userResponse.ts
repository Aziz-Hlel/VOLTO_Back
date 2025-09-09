import { Gender, Role, Tier } from '@prisma/client';

export class UserResponseDto {
  id: string;
  email: string;
  gender: Gender;
  phoneNumber?: string;
  username: string;
  role: Role;
  tier: Tier;
}
