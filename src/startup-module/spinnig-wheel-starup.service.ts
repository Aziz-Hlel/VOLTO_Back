import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";



@Injectable()
export class SpinningWheelInitService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SpinningWheelInitService.name);

    async onApplicationBootstrap() {
        this.logger.log('Setting up scheduled tasks...');
        // ! add it later to check if there s already an instance of spinning wheel with isActive true and has 5 rewards
        // Add scheduler setup logic here
    }
}