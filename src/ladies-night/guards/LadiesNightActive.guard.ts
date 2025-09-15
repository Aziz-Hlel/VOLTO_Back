import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { LadiesNightService } from '../ladies-night.service';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class LadiesNightActiveGuard implements CanActivate {
  constructor(private readonly ladiesNightService: LadiesNightService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const eventName = context.switchToWs().getPattern();

    const returnEvent = {
      "consume-drink": "drink-consumed",
      "get-quota": "drink-quota",
      "generate-code": "get-code",
    }

    const isLadiesNightActive =
      await this.ladiesNightService.isLadiesNightActive2();

    if (!isLadiesNightActive){
      client.emit(returnEvent[eventName], {
        success: false,
        error: 'Ladies Night is not active1',
      });
      throw new WsException('Ladies Night is not active');
    }

    return true;
  }
}
