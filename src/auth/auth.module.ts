import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [PassportModule, JwtModule.register({}), UsersModule],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    RolesGuard, // 👈 export guards so other modules can use them
    PassportModule, // 👈 export PassportModule so `AuthGuard()` works elsewhere
    JwtModule, // 👈 export JwtModule so you don’t need to re-import it
  ],
})
export class AuthModule {}
