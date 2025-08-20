import { Controller, Get } from '@nestjs/common';
import { WorkersService } from './workers.service';

@Controller(['workers','worker'])
export class WorkersController {

    constructor(private readonly workersService: WorkersService) { }

    @Get(['','/'])
    async getAllWorkers() {
        return this.workersService.findAll();
    }




}
