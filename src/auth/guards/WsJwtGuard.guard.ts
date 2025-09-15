// ws-jwt.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import ENV from 'src/config/env';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const eventName = context.switchToWs().getPattern();

    const returnEvent = {
      "consume-drink": "drink-consumed",
      "get-quota": "drink-quota",
      "generate-code": "get-code",
    };

    try {
      const token = this.extractToken(client);

      if (!token) {
        client.emit(returnEvent[eventName], { success: false, error: 'No token provided' });
        throw new WsException('Unauthorized');
      };

      const payload = this.jwtService.verify(token, {
        secret: ENV.JWT_ACCESS_SECRET,
      });

      // Store user data on the client
      client['user'] = {
        id: payload.sub,
        ...payload,
      };

      return true;
    } catch (error) {
      console.log('WS Auth Error:', error.message);
      client.emit(returnEvent[eventName], { success: false, error: 'JWT verification failed' });
      throw new WsException('Unauthorized');
    }
  }

  private extractToken(client: Socket): string | null {
    // Try multiple sources
    return (
      client.handshake.auth?.token ||
      client.handshake.query?.token ||
      client.handshake.headers?.authorization?.replace('Bearer ', '') ||
      null
    );
  }
}
