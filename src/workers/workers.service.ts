import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { CreateWorkerDto } from './dto/create-worker.dto';

@Injectable()
export class WorkersService {

    constructor(@Inject('PRISMA_SERVICE') private prisma: PrismaClient) { }


    async findAll() {
        return this.prisma.worker.findMany({
            orderBy: { ranking: 'desc' }, // optional, sort by ranking
        });
    }

    async create(dto: CreateWorkerDto) {
        return this.prisma.worker.create({
            data: {
                name: dto.name,
                occupation: dto.occupation,
                ranking: dto.ranking,
            },
        });
    }


}
