import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { HASHES, HASHES3 } from 'src/redis/hashes';
import REDIS_KEYS from 'src/redis/redisKeys';

@Injectable()
export class LadiesNightService {

    constructor(private prisma: PrismaService, @Inject('REDIS_CLIENT') private readonly redis: Redis,) { }

    static DRINK_QUOTA = 3;
    static msInHours = 1000 * 60 * 60;


    async isLadiesNightActive(): Promise<boolean> {

        const isLadiesNightActive = await this.redis.get(REDIS_KEYS.isLadiesNightAvailable());

        return isLadiesNightActive === "1";
    }

    async updateSavedUserSocketId(userId: string, socketId: string) {

        this.redis.hset(HASHES.LADIES_NIGHT.USER.HASH(userId), HASHES.LADIES_NIGHT.USER.SOCKET_ID(), socketId);
        await this.redis.expire(HASHES.LADIES_NIGHT.USER.HASH(userId), 3600 * 12);

    }


    async getDrinkQuota(): Promise<{ quota: number, exp: number }> {

        return {
            quota: LadiesNightService.DRINK_QUOTA,
            exp: Date.now() + 1000,
        }
    };



    async getUserDrinksConsumed(userId: string): Promise<number> {

        const remainingDrinks = await this.redis.hget(HASHES.LADIES_NIGHT.USER.HASH(userId), HASHES.LADIES_NIGHT.USER.USER_DRINKS_CONSUMED());

        if (!remainingDrinks || !isNaN(Number(remainingDrinks))) return 0;

        if (Number(remainingDrinks) > LadiesNightService.DRINK_QUOTA) {
            // ! add log error here to get notify if this happen because it shouldnt, instead of throwing an error
            throw new BadRequestException('No more drinks for this user');
            // return LadiesNightService.DRINK_QUOTA;
        }


        return Number(remainingDrinks);



    };


    async generateCode(): Promise<string> {

        const existingCodes = await this.redis.hkeys(HASHES.LADIES_NIGHT.CODES());
        const existingCodesSet = new Set(existingCodes);
        const code = this.generateUniqueCode(existingCodesSet);

        return code;

    }


    async getCode(userId: string): Promise<string> {

        const userDrinksConsumed = await this.getUserDrinksConsumed(userId);

        if (userDrinksConsumed > LadiesNightService.DRINK_QUOTA) throw new BadRequestException('No more drinks for this user');

        const existingCode = await this.redis.hget(HASHES.LADIES_NIGHT.USER.HASH(userId), HASHES.LADIES_NIGHT.USER.USER_CODE());

        if (existingCode) return existingCode;

        const code = await this.generateCode();

        await this.redis.hset(HASHES.LADIES_NIGHT.USER.HASH(userId), HASHES.LADIES_NIGHT.USER.USER_CODE(), code);
        await this.redis.hset(HASHES.LADIES_NIGHT.CODES(), code, userId);

        return code;

    }




    async consumeDrink(code: string) {

        const userId = await this.redis.hget(HASHES.LADIES_NIGHT.CODES(), code);

        if (!userId) throw new BadRequestException('No user found with this QR code');


        // const userObject = await this.redis.hgetall(HASHES.LADIES_NIGHT.USER.HASH(userId));
        // if (Object.keys(userObject).length === 0) throw new BadRequestException('No user object found with this QR code');

        const userHashExists = await this.redis.exists(HASHES.LADIES_NIGHT.USER.HASH(userId));

        if (!userHashExists) throw new BadRequestException('Invalid code');

        const userDrinksConsumed = await this.getUserDrinksConsumed(userId);

        if (userDrinksConsumed === LadiesNightService.DRINK_QUOTA) throw new BadRequestException('User exceeded free drinks quota');

        await this.redis.hdel(HASHES.LADIES_NIGHT.CODES(), code);

        await this.redis.hdel(HASHES.LADIES_NIGHT.USER.HASH(userId), HASHES.LADIES_NIGHT.USER.USER_CODE());

        await this.redis.hset(HASHES.LADIES_NIGHT.USER.HASH(userId), HASHES.LADIES_NIGHT.USER.USER_DRINKS_CONSUMED(), userDrinksConsumed + 1);


        const userSocketId = await this.redis.hget(HASHES.LADIES_NIGHT.USER.HASH(userId), HASHES.LADIES_NIGHT.USER.SOCKET_ID());

        return {
            success: true,
            userId: userId,
            userSocketId: userSocketId,
            userDrinksConsumed: userDrinksConsumed + 1
        };


    }


    async getUserQuota(userId: string) {

        const drinksConsumed = await this.getUserDrinksConsumed(userId);

        const { quota, exp } = await this.getDrinkQuota();

        const code = await this.getCode(userId);

        return {
            drinksConsumed,
            code,
            quota,
            exp
        };
    }



    generateUniqueCode(existingCodes: Set<string>): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const codeLength = 6;

        let code: string;

        do {
            code = Array.from({ length: codeLength }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        } while (existingCodes.has(code));

        return code;
    };





}
