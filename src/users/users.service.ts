import { Injectable,  UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/Dto/create-user';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

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

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }




}
