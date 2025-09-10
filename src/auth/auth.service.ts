import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';
import { UserMapper } from 'src/users/Mapper/usersMapper';
import { AuthUser } from 'src/users/Dto/AuthUser';
import { UserResponseDto } from 'src/users/Dto/userResponse';
import ENV from 'src/config/env';
import { User } from '@prisma/client';
import { CreateCustomerDto } from 'src/users/Dto/create-customer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  static jwtExpirationTime = ['production', 'stage'].includes(ENV.NODE_ENV)
    ? '15m'
    : '1h';
  static refreshExpirationTime = ['production', 'stage'].includes(ENV.NODE_ENV)
    ? '7d'
    : '30d';

  async registerCustomer(dto: CreateCustomerDto) {
    const user = await this.usersService.registerCustomer(dto);

    const {accessToken, refreshToken} = this.getTokens(user);

    const userDto = UserMapper.toResponse(user);

    return {accessToken, refreshToken, user: userDto};
  }

  async login(email: string, password: string) {

    const validatedUser = await this.validateUser(email, password);

    const {accessToken, refreshToken} = this.getTokens(validatedUser);

    const userDto = UserMapper.toResponse(validatedUser);

    return { accessToken, refreshToken, user: userDto };
  }

  async refresh(refreshToken: string) {
    try {
      const payload: { sub: string } = await this.jwtService.verify(
        refreshToken,
        {
          secret: ENV.JWT_REFRESH_SECRET,
        },
      );

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
      expiresIn: AuthService.jwtExpirationTime,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: ENV.JWT_REFRESH_SECRET,
      expiresIn: AuthService.refreshExpirationTime,
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
