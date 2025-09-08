import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { LadiesNightService } from "../ladies-night.service";
import { WsException } from "@nestjs/websockets/errors/ws-exception";



@Injectable()
export class LadiesNightActiveGuard implements CanActivate {

    constructor(private readonly ladiesNightService: LadiesNightService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // const client = context.switchToWs().getClient();
        const isLadiesNightActive = await this.ladiesNightService.isLadiesNightActive2()

        if (!isLadiesNightActive)
            throw new WsException('Ladies Night is not active right now');

        return true;

    }
}