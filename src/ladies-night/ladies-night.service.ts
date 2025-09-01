import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { HASHES, HASHES3 } from 'src/redis/hashes';

@Injectable()
export class LadiesNightService {

    constructor(private prisma: PrismaService, @Inject('REDIS_CLIENT') private readonly redis: Redis,) { }

    static DRINK_QUOTA = 3;




    async getQrCode(userId: string) {
        const token = await this.redis.hget(HASHES.LADIES_NIGHT.USER_TO_CODE(), userId);

        return token;
    }


    async getUserRemainingDrinks(userId: string): Promise<number> {

        const remainingDrinks = await this.redis.hget(HASHES.LADIES_NIGHT.USER_DRINKS_CONSUMED(userId), "user_drinks_consumed");

        if (!remainingDrinks || !isNaN(Number(remainingDrinks))) return LadiesNightService.DRINK_QUOTA;

        if (Number(remainingDrinks) > LadiesNightService.DRINK_QUOTA) return 0;

        const nbrRemainingDrinks = LadiesNightService.DRINK_QUOTA - Number(remainingDrinks)

        return nbrRemainingDrinks;

    };



    async getUserDrinksConsumed(userId: string): Promise<number> {

        const remainingDrinks = await this.redis.hget(HASHES.LADIES_NIGHT.USER_DRINKS_CONSUMED(userId), "user_drinks_consumed");

        if (!remainingDrinks || !isNaN(Number(remainingDrinks))) return 0;

        if (Number(remainingDrinks) > LadiesNightService.DRINK_QUOTA) {
            // ! add log error here to get notify if this happen because it shouldnt 
            return LadiesNightService.DRINK_QUOTA;
        }


        return Number(remainingDrinks);



    };

    async generateCode(): Promise<string> {

        const existingCodes = await this.redis.hkeys(HASHES.LADIES_NIGHT.CODE_TO_USER());
        const existingCodesSet = new Set(existingCodes);
        const code = this.generateUniqueCode(existingCodesSet);

        return code;

    }


    async getCode(userId: string): Promise<string> {

        const userRemainingDrinks = await this.getUserRemainingDrinks(userId);

        if (userRemainingDrinks < 0) throw new BadRequestException('No more drinks for this user');

        const existingCode = await this.redis.hget(HASHES.LADIES_NIGHT.USER_TO_CODE(), userId);

        if (existingCode) return existingCode;

        const code = await this.generateCode();

        await this.redis.hset(HASHES.LADIES_NIGHT.USER_TO_CODE(), userId, code);
        await this.redis.hset(HASHES.LADIES_NIGHT.CODE_TO_USER(), code, userId);

        return code;
    }




    async consumeDrink(userId: string) {

        const userDrinksConsumed = await this.getUserDrinksConsumed(userId);

        if (userDrinksConsumed > LadiesNightService.DRINK_QUOTA) throw new BadRequestException('No more drinks for this user');

        await this.redis.hset(HASHES.LADIES_NIGHT.USER_DRINKS_CONSUMED(userId), "user_drinks_consumed", userDrinksConsumed + 1);



    }





    generateUniqueCode(existingCodes: Set<string>, length = 6): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        let code: string;

        do {
            code = Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        } while (existingCodes.has(code));

        return code;
    };





}
