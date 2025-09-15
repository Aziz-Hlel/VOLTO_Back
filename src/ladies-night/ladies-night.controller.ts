import { Controller, Get } from '@nestjs/common';
import { LadiesNightService } from './ladies-night.service';

@Controller('ladies-night')
export class LadiesNightController {

    constructor(private ladiesNightService: LadiesNightService) {}
    
    @Get()
    async isLadiesNightActive() {
        const isLadiesNightActive = await this.ladiesNightService.isLadiesNightActive2();

        const response = await this.ladiesNightService.getDrinkQuota();
        
        return { isLadiesNightActive, ...response };
    }
}
