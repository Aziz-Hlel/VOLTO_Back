// src/auth/auth.controller.ts
import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CreateUserDto } from '../users/Dto/create-user';
import { Validate } from 'class-validator';
import { AuthGuard } from './guards/jwt.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthUser } from 'src/users/Dto/AuthUser';
import { Roles } from './decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: CreateUserDto) {

        const payload = await this.authService.register(dto);

        return payload;
    }

    @Post('login')
    async login(@Body() dto: { email: string; password: string }) {
        const payload = await this.authService.login(dto.email, dto.password);

        return payload;
    }


    @Post('refresh')
    async refresh(@Body() { refreshToken }: { refreshToken: string }) {

        console.log('Refresh token received:', refreshToken);
        const payload = await this.authService.refresh(refreshToken);

        return payload;
    }



    @UseGuards(AuthGuard)  // AuthGuard first, then RolesGuard
    @Get('me')
    async me(@CurrentUser() user: AuthUser) {
        // console.log(req);
        const userDto = this.authService.me(user);

        return userDto;

    }


    @UseGuards(AuthGuard, RolesGuard)  // AuthGuard first, then RolesGuard
    @Roles(Role.ADMIN)
    @Get('test')
    async test(@CurrentUser() user: AuthUser) {

        return {
            message: 'You are authenticated and authorized!',
            user,
        };

    }





}
