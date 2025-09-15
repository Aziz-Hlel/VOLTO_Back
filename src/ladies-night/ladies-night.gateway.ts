import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import {
  BadRequestException,
  Logger,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/guards/WsJwtGuard.guard';
import { LadiesNightService } from './ladies-night.service';
import type { authSocket } from 'src/events/types/authSocket';
import { JwtService } from '@nestjs/jwt';
import ENV from 'src/config/env';
import REDIS_KEYS from 'src/redis/redisKeys';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

export interface AuthenticatedSocket extends Socket {
  user?: any;
}

interface BaseEventResponse {
  success: boolean;
  error_message?: string;
}

// @UseGuards(LadiesNightActiveGuard)
@WebSocketGateway({ cors: true, namespace: '/ladies-night' })
export class LadiesNightGateway {
  constructor(
    private readonly ladiesNightService: LadiesNightService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(LadiesNightGateway.name);

  @WebSocketServer()
  server: Server; // This is the socket.io server instance

  private extractTokenFromSocket(socket: any): string | null {
    // Check multiple possible locations for the token
    return (
      socket.handshake.query?.token ||
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization?.startsWith('Bearer ')
        ? socket.handshake.headers.authorization.substring(7)
        : null)
    );
  }

  private async isLadiesNightActive() {
    // return true
    const isLadiesNightActive =
      await this.ladiesNightService.isLadiesNightActive2();
    return isLadiesNightActive;
  }

  afterInit(server: Server) {
    // Set up middleware for authentication at server level
    server.use(async (socket: AuthenticatedSocket, next) => {
      try {
        // Check if Ladies Night is active before allowing connections
        const isLadiesNightActive = await this.isLadiesNightActive();

        if (!isLadiesNightActive) {
          this.logger.log(
            'Ladies Night is not active. No connections allowed.',
          );
          throw new Error(
            'Ladies Night is not active. No connections allowed.',
          );
        }
      } catch (error) {
        this.logger.error(
          `Ladies Night is not active, Access denied for socket ${socket.id}: ${error.message}`,
        );
        next(new Error('Ladies Night is not active. No connections allowed'));
      }
      try {
        const token = this.extractTokenFromSocket(socket);

        if (!token) {
          // ? questionnable i think you need a ws exception
          throw new UnauthorizedException('No token provided');
        }

        const payload = this.jwtService.verify(token, {
          secret: ENV.JWT_ACCESS_SECRET,
        });
        // Attach user info to socket
        socket.user = {
          id: payload.sub,
          ...payload,
        };

        this.logger.log(
          `Socket ${socket.id} authenticated for user ${socket.user.id}`,
        );
        next();
      } catch (error) {
        this.logger.error(
          `Authentication failed for socket ${socket.id}: ${error.message}`,
        );
        next(new Error('Authentication failed'));
      }
    });

    this.logger.log(
      'WebSocket Gateway initialized with authentication middleware',
    );
  }

  async handleConnection(@ConnectedSocket() socket: authSocket) {
    console.log(`Client connected: ${socket.id}`);
    await this.ladiesNightService.updateSavedUserSocketId(
      socket.user.id,
      socket.id,
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('get-quota')
  async getQuota(@ConnectedSocket() socket: authSocket) {
    try {
      const userId = socket.user.id;

      const getDrinkQuota = await this.ladiesNightService.getUserQuota(userId);

      socket.emit('drink-quota', getDrinkQuota);
    } catch (error) {
      socket.emit('drink-quota', { success: false, error: error.message });
    }
  }

  @SubscribeMessage('generate-code')
  async generateCode(@ConnectedSocket() socket: authSocket) {
    try {
      const userId = socket.user.id;

      const code = await this.ladiesNightService.getCode(userId);

      socket.emit('get-code', { code: code  , success: true });
    } catch (error) {
      socket.emit('get-code', { code: null, success: false, error: error.message });
    }
  }

  @UseGuards(RolesGuard)
  @Roles(Role.WAITER)
  @SubscribeMessage('consume-drink')
  async consumeDrink(
    @ConnectedSocket() socket: authSocket,
    @MessageBody() payload:{code:string},
  ) {
    try {
      if (!payload.code) throw new WsException('No code provided');

      const response = await this.ladiesNightService.consumeDrink(payload.code);

      socket.emit('drink-consumed', response);

      if (response.userSocketId)
        this.server.to(response.userSocketId).emit('drink-consumed', response);
    } catch (error) {
      socket.emit('drink-consumed', { success: false, error: error.message });
    }
  }
}
