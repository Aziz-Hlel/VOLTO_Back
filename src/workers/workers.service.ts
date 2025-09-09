import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { WorkerMapper } from './mappers/worker.mapper';
import { WorkerResponseDto } from './dto/WorkerResponseDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkerDto): Promise<WorkerResponseDto> {
    const worker = await this.prisma.worker.create({ data: dto });
    return WorkerMapper.toResponse(worker);
  }

  async findAll(): Promise<WorkerResponseDto[]> {
    const workers = await this.prisma.worker.findMany();
    return workers.map(WorkerMapper.toResponse);
  }
}
