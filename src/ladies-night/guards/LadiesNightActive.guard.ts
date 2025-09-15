import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { LadiesNightService } from '../ladies-night.service';
import { WsException } from '@nestjs/websockets/errors/ws-exception';

@Injectable()
export class LadiesNightActiveGuard implements CanActivate {
  constructor(private readonly ladiesNightService: LadiesNightService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<ExecutionContext>();
    const eventName = context.switchToWs().getPattern();

    const returnEvent = {
      "consume-drink": "drink-consumed",
      "get-quota": "drink-quota",
      "generate-code": "code-generated",
    }

    const isLadiesNightActive =
      await this.ladiesNightService.isLadiesNightActive2();

    if (!isLadiesNightActive)
      throw new WsException('Ladies Night is not active right now');

    return true;
  }
}
