import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { WorkerMapper } from './mappers/worker.mapper';
import { WorkerResponseDto } from './dto/WorkerResponseDto';

@Injectable()
export class WorkersService {

    constructor(@Inject('PRISMA_SERVICE') private prisma: PrismaClient) { }


    async create(dto: CreateWorkerDto): Promise<WorkerResponseDto> {
        const worker = await this.prisma.worker.create({ data: dto });
        return WorkerMapper.toResponse(worker);
    }

    async findAll(): Promise<WorkerResponseDto[]> {
        const workers = await this.prisma.worker.findMany();
        return workers.map(WorkerMapper.toResponse);
    }


}
