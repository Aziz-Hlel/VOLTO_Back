import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(@Inject('PRISMA_SERVICE') private prisma: PrismaClient) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  createUser(email: string, password: string) {
    return this.prisma.user.create({
      data: { email, password },
    });
  }
}
