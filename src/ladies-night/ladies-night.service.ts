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

    getNextTransition = (startDay: number, startHour: number, endDay: number, endHour: number): Date => {

        const currentDate = new Date();

        const curDay = currentDate.getUTCDay();
        const curHour = currentDate.getUTCHours();

        // Helper to build a Date from "this week's day/hour"
        function nextDateFrom(day: number, hour: number): Date {
            const result = new Date(Date.UTC(
                currentDate.getUTCFullYear(),
                currentDate.getUTCMonth(),
                currentDate.getUTCDate(),
                hour, 0, 0, 0
            ));

            // Shift forward to the correct day of week
            const diff = (day - result.getUTCDay() + 7) % 7;
            result.setUTCDate(result.getUTCDate() + diff);
            return result;
        }

        const nextStart = nextDateFrom(startDay, startHour);
        const nextEnd = nextDateFrom(endDay, endHour);

        // If we're already past today's boundary, roll forward a week
        if (nextStart <= currentDate) nextStart.setUTCDate(nextStart.getUTCDate() + 7);
        if (nextEnd <= currentDate) nextEnd.setUTCDate(nextEnd.getUTCDate() + 7);

        // Decide which transition is sooner
        return nextStart < nextEnd ? nextStart : nextEnd;
    }



    isInWeeklyWindow = (startDay: number, startHour: number, endDay: number, endHour: number): boolean => {

        const currentDate = new Date();
        const curDay = currentDate.getUTCDay();   // 0 = Sunday, 1 = Monday, ...
        const curHour = currentDate.getUTCHours();

        // Case 1: Same day start & end (e.g., Monday 18-23)
        if (startDay === endDay) {
            return curDay === startDay && curHour >= startHour && curHour < endHour;
        }

        // Case 2: Event spans multiple days (e.g., Friday 22:00 → Saturday 02:00)
        if (curDay === startDay && curHour >= startHour) return true;
        if (curDay === endDay && curHour < endHour) return true;

        // If event covers multiple full days (rare for weekly, but let's be robust)
        if (startDay < endDay && curDay > startDay && curDay < endDay) return true;
        if (startDay > endDay && (curDay > startDay || curDay < endDay)) return true; // wraparound across Sunday

        return false;
    }

    async fetchNstoreLadiesNightTimeStamps() {

        const ladiesNight = await this.prisma.event.findFirst({ where: { isLadiesNight: true } });

        if (!ladiesNight) throw new BadRequestException('Ladies Night event not found in database');

        // if (ladiesNight.startDate.getUTCDay() === new Date().getUTCDay())


        const currentDate = new Date();

        const startDay = ladiesNight.startDate.getUTCDay();
        const startHour = ladiesNight.startDate.getUTCHours();
        const endDay = ladiesNight.endDate.getUTCDay();
        const endHour = ladiesNight.endDate.getUTCHours();


        const active = this.isInWeeklyWindow(startDay, startHour, endDay, endHour);
        const nextTransition = this.getNextTransition(startDay, startHour, endDay, endHour);


        const ttlMs = nextTransition.getTime() - currentDate.getTime();

        await this.redis.set(
            REDIS_KEYS.isLadiesNightAvailable(),
            active ? 1 : 0,
            'PX',
            ttlMs
        );

        return active;



    }



    async isLadiesNightActive(): Promise<boolean> {


        const isLadiesNightActive = await this.redis.get(REDIS_KEYS.isLadiesNightAvailable());
        if (isLadiesNightActive === null) return await this.fetchNstoreLadiesNightTimeStamps();
        return isLadiesNightActive === "1";

    };









    async storeLadiesNightTimeStamps() {

        const ladiesNight = await this.prisma.event.findFirst({ where: { isLadiesNight: true } });

        if (!ladiesNight) throw new BadRequestException('Ladies Night event not found in database');

        await this.redis.hmset("ladies_night", { start_date: ladiesNight.startDate, end_date: ladiesNight.endDate });

        return [ladiesNight.startDate.toDateString(), ladiesNight.endDate.toDateString()];
    }






    async isLadiesNightActive2(): Promise<boolean> {
        let str_startDate_ladiesNight: null | string = null;
        let str_endDate_ladiesNight: null | string = null;
        [str_startDate_ladiesNight, str_endDate_ladiesNight] = await this.redis.hmget("ladies_night", "start_date", "end_date");

        if (str_startDate_ladiesNight === null || str_endDate_ladiesNight === null) {
            [str_startDate_ladiesNight, str_endDate_ladiesNight] = await this.storeLadiesNightTimeStamps();
        }

        const startDate_ladiesNight = new Date(str_startDate_ladiesNight);
        const endDate_ladiesNight = new Date(str_endDate_ladiesNight);

        const startDay = startDate_ladiesNight.getUTCDay();
        const startHour = startDate_ladiesNight.getUTCHours();
        const endDay = endDate_ladiesNight.getUTCDay();
        const endHour = endDate_ladiesNight.getUTCHours();


        const currentDate = new Date();
        const curDay = currentDate.getUTCDay();   // 0 = Sunday, 1 = Monday, ...
        const curHour = currentDate.getUTCHours();

        // Case 1: Same day start & end (e.g., Monday 18-23)
        if (startDay === endDay) {
            return curDay === startDay && curHour >= startHour && curHour < endHour;
        }

        // Case 2: Event spans multiple days (e.g., Friday 22:00 → Saturday 02:00)
        if (curDay === startDay && curHour >= startHour) return true;
        if (curDay === endDay && curHour < endHour) return true;

        // If event covers multiple full days (rare for weekly, but let's be robust)
        if (startDay < endDay && curDay > startDay && curDay < endDay) return true;
        if (startDay > endDay && (curDay > startDay || curDay < endDay)) return true; // wraparound across Sunday

        return false;

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
        console.log('remainingDrinks', remainingDrinks);

        if (!remainingDrinks || isNaN(Number(remainingDrinks))) return 0;

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


    async getCode(userId: string): Promise<string | null> {

        const userDrinksConsumed = await this.getUserDrinksConsumed(userId);

        if (userDrinksConsumed > LadiesNightService.DRINK_QUOTA) return null;

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
        console.log("userDrinksConsumed", userDrinksConsumed);

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


    getAllLadiesNightUsers = async () => {
        let cursor = "0";
        const keys: string[] = [];

        do {
            // SCAN returns [newCursor, matchedKeys]
            const [newCursor, matchedKeys] = await this.redis.scan(cursor, "MATCH", HASHES.LADIES_NIGHT.USER.ALL_HASH(), "COUNT", 100);
            cursor = newCursor;
            keys.push(...matchedKeys);
        } while (cursor !== "0");

        return keys;
    }


    getDrinksStats = async (): Promise<{ totalDrinksConsumed: number, usersWithDrinks: number }> => {
        const keys = await this.getAllLadiesNightUsers();
        if (keys.length === 0) return { totalDrinksConsumed: 0, usersWithDrinks: 0 };

        const pipeline = this.redis.pipeline();
        keys.forEach((key) => pipeline.hget(key, HASHES.LADIES_NIGHT.USER.USER_DRINKS_CONSUMED()));
        const results = await pipeline.exec();

        let usersWithDrinks = 0;

        let totalDrinksConsumed = 0;


        for (let i = 0; i < keys.length; i++) {

            const [err, value] = results![i];
            if (err) {
                console.warn(`Failed to get user_drinks_consumed for key ${keys[i]}:`, err);
                continue;
            }

            const drinksConsumed = parseInt(value as string) || 0;
            totalDrinksConsumed += drinksConsumed;

            if (drinksConsumed > 0) {
                usersWithDrinks++;
            }
        }

        return { totalDrinksConsumed, usersWithDrinks };


    }

    saveStatsToDb = async () => {

        const isLadiesNightActive = await this.isLadiesNightActive2();

        if (!isLadiesNightActive) return;

        const stats = await this.getDrinksStats();

        await this.prisma.stats.create({
            data: {
                event: 'LadiesNight',
                date: new Date(),
                totalParticipants: stats.usersWithDrinks,
                drinksConsumed: stats.totalDrinksConsumed,
                quota: LadiesNightService.DRINK_QUOTA
            }
        });

    }


}
