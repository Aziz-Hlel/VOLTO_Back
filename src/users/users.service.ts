import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/Dto/create-user';

@Injectable()
export class UsersService {
  constructor(@Inject('PRISMA_SERVICE') private prisma: PrismaClient) { }

  findAll() {
    return this.prisma.user.findMany();
  }

  createUser(dto: CreateUserDto, hashedPassword: string) {
    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      }
    });
  }


  async register(dto: CreateUserDto) {
    
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const savedUser = await this.createUser(dto, hashedPassword);

    return savedUser
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }




}
