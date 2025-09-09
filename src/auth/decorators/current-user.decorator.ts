import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from 'src/users/Dto/AuthUser';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    const payload = request.user;
    if (!payload) throw new Error('User not found in request');

    const authUser = {
      ...payload,
      id: payload.sub,
    };
    return authUser;
  },
);
