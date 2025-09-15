import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import { HASHES, HASHES3 } from 'src/redis/hashes';
import REDIS_KEYS from 'src/redis/redisKeys';
import cronParser from 'cron-parser';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class LadiesNightService {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  static DRINK_QUOTA = 3;
  static msInHours = 1000 * 60 * 60;

  async storeLadiesNightTimeStamps() {
    const ladiesNight = await this.prisma.event.findFirst({
      where: { isLadiesNight: true },
    });

    if (!ladiesNight)
      throw new BadRequestException('Ladies Night event not found in database');
    if (!ladiesNight.cronStartDate || !ladiesNight.cronEndDate)
      throw new BadRequestException('Ladies Night cron dates are not set');

    await this.redis.hmset(HASHES.LADIES_NIGHT.DATE.HASH(), {
      [HASHES.LADIES_NIGHT.DATE.CRON_START_DATE()]: ladiesNight.cronStartDate,
      [HASHES.LADIES_NIGHT.DATE.CRON_END_DATE()]: ladiesNight.cronEndDate,
    });

    return [ladiesNight.cronStartDate, ladiesNight.cronEndDate];
  }

  async isLadiesNightActive2(): Promise<boolean> {
    let cronStartDate_ladiesNight: null | string = null;
    let cronEndDate_ladiesNight: null | string = null;
    [cronStartDate_ladiesNight, cronEndDate_ladiesNight] =
      await this.redis.hmget(
        HASHES.LADIES_NIGHT.DATE.HASH(),
        HASHES.LADIES_NIGHT.DATE.CRON_START_DATE(),
        HASHES.LADIES_NIGHT.DATE.CRON_END_DATE(),
      );

    if (
      cronStartDate_ladiesNight === null ||
      cronEndDate_ladiesNight === null
    ) {
      [cronStartDate_ladiesNight, cronEndDate_ladiesNight] =
        await this.storeLadiesNightTimeStamps();
    }

    const currentDate = new Date();

    const startInterval = cronParser.parse(cronStartDate_ladiesNight, {
      currentDate,
    });
    const startDate = startInterval.prev().toDate();

    const endInterval = cronParser.parse(cronEndDate_ladiesNight, {
      currentDate: startDate,
    }); // Get this week's end date
    const endDate = endInterval.next().toDate();

    const inInterval = currentDate >= startDate && currentDate <= endDate;

    return inInterval;
  }

  async updateSavedUserSocketId(userId: string, socketId: string) {
    this.redis.hset(
      HASHES.LADIES_NIGHT.USER.HASH(userId),
      HASHES.LADIES_NIGHT.USER.SOCKET_ID(),
      socketId,
    );
    await this.redis.expire(HASHES.LADIES_NIGHT.USER.HASH(userId), 3600 * 12);
  }

  async getDrinkQuota(): Promise<{ quota: number; eventStartDate: string|null; eventEndDate: string|null }> {

    // ? bch nradhi 7ama none less
    const [cronStartDate_ladiesNight, cronEndDate_ladiesNight] = await this.redis.hmget(
      HASHES.LADIES_NIGHT.DATE.HASH(),
      HASHES.LADIES_NIGHT.DATE.CRON_START_DATE(),
      HASHES.LADIES_NIGHT.DATE.CRON_END_DATE(),
    );
    
    return {
      quota: LadiesNightService.DRINK_QUOTA,
      eventStartDate: cronStartDate_ladiesNight,
      eventEndDate: cronEndDate_ladiesNight,
    };

  }

  async getUserDrinksConsumed(userId: string): Promise<number> {
    const remainingDrinks = await this.redis.hget(
      HASHES.LADIES_NIGHT.USER.HASH(userId),
      HASHES.LADIES_NIGHT.USER.USER_DRINKS_CONSUMED(),
    );
    console.log('remainingDrinks', remainingDrinks);

    if (!remainingDrinks || isNaN(Number(remainingDrinks))) return 0;

    if (Number(remainingDrinks) > LadiesNightService.DRINK_QUOTA) {
      throw new BadRequestException('user consumed drinks more than quota');
    }

    return Number(remainingDrinks);
  }

  async generateCode(): Promise<string> {
    const existingCodes = await this.redis.hkeys(HASHES.LADIES_NIGHT.CODES());
    const existingCodesSet = new Set(existingCodes);
    const code = this.generateUniqueCode(existingCodesSet);

    return code;
  }

  async getCode(userId: string): Promise<string | null> {

    const isLadiesNightActive = await this.isLadiesNightActive2();
    if(!isLadiesNightActive) throw new BadRequestException('Ladies Night is not active');

    const userDrinksConsumed = await this.getUserDrinksConsumed(userId);

    if (userDrinksConsumed > LadiesNightService.DRINK_QUOTA)
      throw new BadRequestException('user consumed drinks more than quota');

    if (userDrinksConsumed === LadiesNightService.DRINK_QUOTA) return null;

    const existingCode = await this.redis.hget(
      HASHES.LADIES_NIGHT.USER.HASH(userId),
      HASHES.LADIES_NIGHT.USER.USER_CODE(),
    );

    if (existingCode) return existingCode;

    const code = await this.generateCode();

    await this.redis.hset(
      HASHES.LADIES_NIGHT.USER.HASH(userId),
      HASHES.LADIES_NIGHT.USER.USER_CODE(),
      code,
    );
    await this.redis.hset(HASHES.LADIES_NIGHT.CODES(), code, userId);

    return code;
  }

  async consumeDrink(code: string) {

    const isLadiesNightActive = await this.isLadiesNightActive2();
    if(!isLadiesNightActive) throw new WsException('Ladies Night is not active');


    const userId = await this.redis.hget(HASHES.LADIES_NIGHT.CODES(), code);

    if (!userId)
      throw new BadRequestException('No user found with this QR code');

    // const userObject = await this.redis.hgetall(HASHES.LADIES_NIGHT.USER.HASH(userId));
    // if (Object.keys(userObject).length === 0) throw new BadRequestException('No user object found with this QR code');

    const userHashExists = await this.redis.exists(
      HASHES.LADIES_NIGHT.USER.HASH(userId),
    );

    if (!userHashExists) throw new BadRequestException('Invalid code');

    const userDrinksConsumed = await this.getUserDrinksConsumed(userId);
    console.log('userDrinksConsumed', userDrinksConsumed);

    if (userDrinksConsumed === LadiesNightService.DRINK_QUOTA)
      throw new BadRequestException('User exceeded free drinks quota');

    await this.redis.hdel(HASHES.LADIES_NIGHT.CODES(), code);

    await this.redis.hdel(
      HASHES.LADIES_NIGHT.USER.HASH(userId),
      HASHES.LADIES_NIGHT.USER.USER_CODE(),
    );

    await this.redis.hset(
      HASHES.LADIES_NIGHT.USER.HASH(userId),
      HASHES.LADIES_NIGHT.USER.USER_DRINKS_CONSUMED(),
      userDrinksConsumed + 1,
    );

    const userSocketId = await this.redis.hget(
      HASHES.LADIES_NIGHT.USER.HASH(userId),
      HASHES.LADIES_NIGHT.USER.SOCKET_ID(),
    );

    return {
      success: true,
      userId: userId,
      userSocketId: userSocketId,
      userDrinksConsumed: userDrinksConsumed + 1,
    };
  }

  async getUserQuota(userId: string) {

    const isLadiesNightActive = await this.isLadiesNightActive2();
    if(!isLadiesNightActive) throw new BadRequestException('Ladies Night is not active');

    const drinksConsumed = await this.getUserDrinksConsumed(userId);

    const { quota, } = await this.getDrinkQuota();

    const code = await this.getCode(userId);

    return {
      success: true,
      drinksConsumed,
      code,
      quota,
    };
  }

  generateUniqueCode(existingCodes: Set<string>): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;

    let code: string;

    do {
      code = Array.from(
        { length: codeLength },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join('');
    } while (existingCodes.has(code));

    return code;
  }

  getAllLadiesNightUsers = async () => {
    let cursor = '0';
    const keys: string[] = [];

    do {
      // SCAN returns [newCursor, matchedKeys]
      const [newCursor, matchedKeys] = await this.redis.scan(
        cursor,
        'MATCH',
        HASHES.LADIES_NIGHT.USER.ALL_HASH(),
        'COUNT',
        100,
      );
      cursor = newCursor;
      keys.push(...matchedKeys);
    } while (cursor !== '0');

    return keys;
  };

  getDrinksStats = async (): Promise<{
    totalDrinksConsumed: number;
    usersWithDrinks: number;
  }> => {
    const keys = await this.getAllLadiesNightUsers();
    if (keys.length === 0)
      return { totalDrinksConsumed: 0, usersWithDrinks: 0 };

    const pipeline = this.redis.pipeline();
    keys.forEach((key) =>
      pipeline.hget(key, HASHES.LADIES_NIGHT.USER.USER_DRINKS_CONSUMED()),
    );
    const results = await pipeline.exec();

    let usersWithDrinks = 0;

    let totalDrinksConsumed = 0;

    for (let i = 0; i < keys.length; i++) {
      const [err, value] = results![i];
      if (err) {
        console.warn(
          `Failed to get user_drinks_consumed for key ${keys[i]}:`,
          err,
        );
        continue;
      }

      const drinksConsumed = parseInt(value as string) || 0;
      totalDrinksConsumed += drinksConsumed;

      if (drinksConsumed > 0) {
        usersWithDrinks++;
      }
    }

    return { totalDrinksConsumed, usersWithDrinks };
  };

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
        quota: LadiesNightService.DRINK_QUOTA,
      },
    });
  };
}
