import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Controller(['workers', 'worker'])
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get(['', '/'])
  async getAllWorkers() {
    return this.workersService.findAll();
  }

  @Post()
  create(@Body() dto: CreateWorkerDto) {
    return this.workersService.create(dto);
  }
}
