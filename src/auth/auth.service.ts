import {  Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {  User } from 'generated/prisma';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/Dto/create-user';
import { UserMapper } from 'src/users/Mapper/usersMapper';
import { AuthUser } from 'src/users/Dto/AuthUser';
import { UserResponseDto } from 'src/users/Dto/userResponse';
import ENV from 'src/config/env';

@Injectable()
export class AuthService {



    constructor(private usersService: UsersService, private jwtService: JwtService,) { }


    async register(dto: CreateUserDto) {

        const user = await this.usersService.register(dto);

        const tokens = this.getTokens(user);

        return tokens;

    }

    async login(email: string, password: string) {
        const validatedUser = await this.validateUser(email, password);

        const tokens = this.getTokens(validatedUser);

        return tokens;

    }



    async refresh(refreshToken: string) {


        try {

            const payload = await this.jwtService.verify(refreshToken, { secret: ENV.JWT_REFRESH_SECRET, });

            const user = await this.usersService.findById(payload.sub);
            if (!user) throw new UnauthorizedException('User not found');

            const tokens = this.getTokens(user);

            return tokens;

        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }




    async validateUser(email: string, password: string) {

        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

        return user;

    }

    public getTokens(user: User) {

        const payload = UserMapper.toTokenPayload(user);

        const accessToken = this.jwtService.sign(payload, {
            secret: ENV.JWT_ACCESS_SECRET,
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: ENV.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });
        return { accessToken, refreshToken };
    }



   
    async me(user: AuthUser): Promise<UserResponseDto> {

        const foundUser = await this.usersService.findById(user.id);
        if (!foundUser) throw new UnauthorizedException('User not found');

        const userDto = UserMapper.toResponse(foundUser);

        return userDto;
    }


}
