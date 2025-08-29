import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { HASHES } from 'src/redis/hashes';

@Injectable()
export class LadiesNightService {

    constructor(private prisma: PrismaService, @Inject('REDIS_CLIENT') private readonly redis: Redis,) { }

    static DRINK_QUOTA = 3;

    async qtore(userId: string, token: string) {
        // store with expiration
        await this.redis.set(`refresh:${userId}`, token, 'EX', 60 * 60 * 24 * 7); // 7 days
    }



    async getQrCode(userId: string) {
        const token = await this.redis.hget(HASHES.USERS, userId);

        return token;
    }


    async getUserRemainingDrinks(userId: string) {

        const remainingDrinks = await this.redis.hget(HASHES.DRINKS_CONSUMED, userId);

        if (!remainingDrinks || !isNaN(Number(remainingDrinks))) return LadiesNightService.DRINK_QUOTA;

        if (Number(remainingDrinks) > LadiesNightService.DRINK_QUOTA) return 0;

        const nbrRemainingDrinks = LadiesNightService.DRINK_QUOTA - Number(remainingDrinks)

        return nbrRemainingDrinks;

    }



    async generateCode() {
        const existingCodes = await this.redis.hkeys(HASHES.QR_CODE);
        const existingCodesSet = new Set(existingCodes);
        const code = this.generateUniqueCode(existingCodesSet);

        


    }











    generateUniqueCode(existingCodes: Set<string>, length = 6): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        let code: string;

        do {
            code = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        } while (existingCodes.has(code));

        return code;
    }
}
