// src/auth/auth.controller.ts
import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { CreateUserDto } from '../users/Dto/create-user';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: CreateUserDto) {

        const payload = await this.authService.register(dto);

    }

    @Post('login')
    async login(@Body() dto: { email: string; password: string }) {
        const payload = await this.authService.login(dto.email, dto.password);

    }

    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refresh(body.refreshToken);
    }
}
