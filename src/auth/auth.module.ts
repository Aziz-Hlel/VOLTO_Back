import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, RolesGuard,],
  controllers: [AuthController]
})
export class AuthModule { }
