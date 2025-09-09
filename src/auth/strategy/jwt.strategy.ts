import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtUserToken as JwtPayload } from 'src/users/Dto/jwtUserToken';
import { AuthUser } from 'src/users/Dto/AuthUser';
import ENV from 'src/config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: ENV.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      ...payload,
      id: payload.sub,
    };
  }
}
