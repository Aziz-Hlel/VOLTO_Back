import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class WorkersService {

    constructor(@Inject('PRISMA_SERVICE') private prisma: PrismaClient) { }


    async findAll() {
        return this.prisma.worker.findMany({
            orderBy: { ranking: 'desc' }, // optional, sort by ranking
        });
    }

}
