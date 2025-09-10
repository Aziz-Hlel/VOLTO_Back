// src/auth/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/Dto/create-user';
import { JwtAccessGuard } from './guards/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthUser } from 'src/users/Dto/AuthUser';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { LoginRequestDto } from './dto/loginRequestDto';
import { Role } from '@prisma/client';
import { CreateCustomerDto } from 'src/users/Dto/create-customer';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('register')
  async registerCustomer(@Body() dto: CreateCustomerDto) {
    const payload = await this.authService.registerCustomer(dto);

    return payload;
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @HttpCode(201)
  @Post('register-admin')
  async adminRegister(@Body() dto: CreateUserDto) {
    const payload = await this.authService.registerCustomer(dto);

    return payload; 
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    const payload = await this.authService.login(dto.email, dto.password);

    return payload;
  }

  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() { refreshToken }: { refreshToken: string }) {
    console.log('Refresh token received:', refreshToken);
    const payload = await this.authService.refresh(refreshToken);

    return payload;
  }

  @UseGuards(JwtAccessGuard)
  @HttpCode(200)
  @Get('me')
  async me(@CurrentUser() user: AuthUser) {
    // console.log(req);
    const userDto = this.authService.me(user);

    return userDto;
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.ADMIN,Role.SUPER_ADMIN)
  @HttpCode(200)
  @Get('test')
  test(@CurrentUser() user: AuthUser) {
    return {
      message: 'You are authenticated and authorized!',
      user,
    };
  }
}
