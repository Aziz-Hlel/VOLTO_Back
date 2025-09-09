import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/Dto/create-user';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './Dto/create-customer';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  createCustomer(dto: CreateCustomerDto, hashedPassword: string) {
    return this.prisma.user.create({
      data: {
        ...dto,
        role: Role.USER,
        password: hashedPassword,
      },
    });
  }

  async registerCustomer(dto: CreateCustomerDto) {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) throw new UnauthorizedException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const savedUser = await this.createCustomer(dto, hashedPassword);

    return savedUser;
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
