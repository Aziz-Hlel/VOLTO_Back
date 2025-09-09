import { Role } from '@prisma/client';

export class jwtUserToken {
  sub: string;
  email: string;
  username: string;
  role: Role;
}
