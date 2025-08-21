import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from 'generated/prisma';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/Dto/create-user';
import { UserMapper } from 'src/users/Mapper/usersMapper';

@Injectable()
export class AuthService {

    // constructor(@Inject('PRISMA_SERVICE') private prisma: PrismaClient) { }


    constructor(private usersService: UsersService, private jwtService: JwtService,) { }


    async register(dto: CreateUserDto) {

        const user = await this.usersService.register(dto);

        const tokens = this.getTokens(user);

        const userResponseDto = UserMapper.toResponse(user);

        return {
            userResponseDto,
            ...tokens
        };

    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);

        const tokens = this.getTokens(user);

        const userResponseDto = UserMapper.toResponse(user);

        return {
            userResponseDto,
            ...tokens
        };
    }



    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const newPayload = { sub: payload.sub, username: payload.username };

            return {
                accessToken: this.jwtService.sign(newPayload, { expiresIn: '15m' }),
                refreshToken: this.jwtService.sign(newPayload, {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: '7d',
                }),
            };
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }




    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    public getTokens(user: User) {

        const payload = UserMapper.toTokenPayload(user);

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });
        return { accessToken, refreshToken };
    }






}
