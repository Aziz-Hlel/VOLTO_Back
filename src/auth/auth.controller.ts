// src/auth/auth.controller.ts
import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { CreateUserDto } from '../users/Dto/create-user';
import { Validate } from 'class-validator';
import { JwtAuthGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthUser } from 'src/users/Dto/AuthUser';

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



    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@CurrentUser() user: AuthUser) {
        // console.log(req);
        const userDto = this.authService.me(user);

        return userDto;
        
    }


    @UseGuards(JwtAuthGuard)
    @Get('test')
    async test(@Req() req) {
        // console.log(req);
        return {
            message: 'You are authenticated!',
            user: req.user, // populated by JwtStrategy.validate()

        };
    }





}
