import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSpinnigWheel } from './dto/create-spinnig-wheel.dto';
import { UpdateSpinnigWheelDto } from './dto/update-spinnig-wheel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Redis } from 'ioredis';
import { HASHES } from 'src/redis/hashes';
import { IsSpinningWheelAvailableResponse,  } from './dto/active-spinning-wheel.dto';
import { UserQuotaResponseDto } from './dto/user-quota-response.dto';
import { SpinnigWheelRewardService } from 'src/spinnig-wheel-reward/spinnig-wheel-reward.service';
import { RedeemCodeResponseDto } from './dto/RedeemCodeResponse.dto';

@Injectable()
export class SpinnigWheelService {
  constructor(private readonly prisma: PrismaService,
     @Inject('REDIS_CLIENT') private readonly redis: Redis,
     private readonly spinnigWheelRewardService: SpinnigWheelRewardService
  ) {}

  
  async updateWheelCache(): Promise<IsSpinningWheelAvailableResponse> {
      const spinnigWheel = await this.prisma.spinningWheel.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!spinnigWheel) throw new InternalServerErrorException('No active spinnig wheel instance found');

    const spinningWheelHashName = HASHES.SPINNING_WHEEL.DATE.HASH();
    await this.redis.hmset(spinningWheelHashName, {
      [HASHES.SPINNING_WHEEL.DATE.START_DATE()]: spinnigWheel.startDate.toISOString(),
      [HASHES.SPINNING_WHEEL.DATE.END_DATE()]: spinnigWheel.endDate.toISOString(),
      [HASHES.SPINNING_WHEEL.DATE.NAME()]: spinnigWheel.name
    },);

    const redisTtl : number = 3600 * 24 * 365;
    await this.redis.expire(spinningWheelHashName, redisTtl);

    const currentDate = new Date();
    
    if ( currentDate < spinnigWheel.startDate  || currentDate > spinnigWheel.endDate )
      return {
        isAvailable: false,
        name: spinnigWheel.name,
        startDate : currentDate < spinnigWheel.startDate ? spinnigWheel.startDate : undefined
      };

    return {
      name: spinnigWheel.name,
      startDate: spinnigWheel.startDate,
      endDate: spinnigWheel.endDate,
      isAvailable: true
    };
  }

  async isSpinningWheelAvailable(): Promise<IsSpinningWheelAvailableResponse>{

    let [strStartDate, strEndDate, spinnigWheelName] = await this.redis.hmget(
      HASHES.SPINNING_WHEEL.DATE.HASH(),
      HASHES.SPINNING_WHEEL.DATE.START_DATE(),
      HASHES.SPINNING_WHEEL.DATE.END_DATE(),
      HASHES.SPINNING_WHEEL.DATE.NAME(),
    )

    if (!strStartDate || !strEndDate ) return await this.updateWheelCache();

    const currentDate = new Date();
    
    const startDate = new Date(strStartDate);
    const endDate = new Date(strEndDate);

    if ( currentDate < startDate  || currentDate > endDate )
      return {
        isAvailable: false,
        name: spinnigWheelName,
        startDate : currentDate < startDate ? startDate : undefined
      };

    return {
      name: spinnigWheelName,
      startDate,
      endDate,
      isAvailable:true
    };

  }

  async isSpinnigWheelExists() {
    const spinnigWheel = await this.prisma.spinningWheel.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!spinnigWheel) return null;

    return spinnigWheel;
  }

  create(createSpinnigWheelDto: CreateSpinnigWheel) {
    if (this.isSpinnigWheelExists() === null)
      throw new BadRequestException('There is already an active spinnig wheel');

    const oldDate = new Date('2000-01-01T00:00:00Z');

    return this.prisma.spinningWheel.create({
      data: {
        name: createSpinnigWheelDto.name,
        startDate: oldDate,
        endDate: oldDate,
        isActive: true,
      },
    });
  }

  getWheel = async () => {
    const spinnigWheel = await this.prisma.spinningWheel.findFirst({
      where: {
        isActive: true,
      },
      include: {
        rewardList: true,
      },
    });
    if (!spinnigWheel)
      throw new InternalServerErrorException('No active spinnig wheel found');

    return spinnigWheel;
  };
  

  async deleteUserHashes() {
  const pattern = HASHES.SPINNING_WHEEL.USER.ALL_HASH();
  let cursor = '0';
  
  do {
    const [newCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = newCursor;

    if (keys.length > 0) {
      await this.redis.del(...keys); // delete all found keys
    }
  } while (cursor !== '0');

  } 

  update = async (updateSpinnigWheelDto: UpdateSpinnigWheelDto) => {

    // if((await this.isSpinningWheelAvailable()).isAvailable)
    //   throw new BadRequestException('Cannot update while spinning wheel event is active');

    const spinnigWheel = await this.prisma.spinningWheel.findFirst({
      where: {
        id: updateSpinnigWheelDto.id,
        isActive: true,
      },
    });
    if (!spinnigWheel)
      throw new BadRequestException(
        'No active spinnig wheel found with this id',
      );

    const updatedWheel =await this.prisma.spinningWheel.update({
      where: { id: updateSpinnigWheelDto.id },
      data: {
        name: updateSpinnigWheelDto.name,
        startDate: updateSpinnigWheelDto.startDate,
        endDate: updateSpinnigWheelDto.endDate,
        rewardList: {
          update: updateSpinnigWheelDto.rewardList.map(r => ({
            where: { id: r.id },
            data: { name: r.name },
          })),
        },
      },
      include: { rewardList: true },
    });

    this.redis.del(HASHES.SPINNING_WHEEL.DATE.HASH());
    this.spinnigWheelRewardService.updateRewardsCache(updatedWheel.rewardList);
    if ( spinnigWheel.startDate !== updatedWheel.startDate || spinnigWheel.endDate !== updatedWheel.endDate )
      this.deleteUserHashes();

    return updatedWheel;
  };




  async getQuota(userId: string): Promise<UserQuotaResponseDto> {

    const isSpinningWheelAvailable = await this.isSpinningWheelAvailable();

    if (!isSpinningWheelAvailable.isAvailable)
      throw new BadRequestException('Spinning wheel is not available');

    const user =await this.redis.hgetall(HASHES.SPINNING_WHEEL.USER.HASH(userId));
    if(Object.keys(user).length === 0 )
      return {
    hasPlayed: false,
    code: null,
    codeRedeemed: false

  };
  
  const rewardId = user[HASHES.SPINNING_WHEEL.USER.REWARD_ID()]
  const rewardObject = await this.spinnigWheelRewardService.getRewardById(rewardId);
  
  if(!rewardObject.exist)
    throw new BadRequestException('Reward with the id doesnt exist')
  
  if(user[HASHES.SPINNING_WHEEL.USER.USER_REDEEMED_CODE()]==='true')
    return {
  hasPlayed: true,
  code: null,
  codeRedeemed: true,
  winningPrize : rewardObject.rewardName
}
    return {
      hasPlayed: true,
      code: user[HASHES.SPINNING_WHEEL.USER.USER_CODE()],
      codeRedeemed: false,
      winningPrize : rewardObject.rewardName
    }


}

  async generateUniqueCode(): Promise<string>{
    const existingCodes = await this.redis.hkeys(HASHES.SPINNING_WHEEL.CODES());
    const existingCodesSet = new Set(existingCodes);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 6;

    let code: string;

    do {
      code = Array.from(
        { length: codeLength },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join('');
    } while (existingCodesSet.has(code));

    return code;
  }


  async generateCode({userId, wheelRewardId}:{userId: string, wheelRewardId: string}){

    const isSpinningWheelAvailable = await this.isSpinningWheelAvailable();

    if (!isSpinningWheelAvailable.isAvailable)
      throw new BadRequestException('Spinning wheel is not available');
    
    const isRewardExists = await this.spinnigWheelRewardService.getRewardById(wheelRewardId);

    if(!isRewardExists.exist)
      throw new BadRequestException('Reward does not exist');
    

    const userCachedDetails = await this.redis.hgetall(HASHES.SPINNING_WHEEL.USER.HASH(userId));


    if(userCachedDetails[HASHES.SPINNING_WHEEL.USER.USER_REDEEMED_CODE()]==='true')
      throw new BadRequestException('Code already redeemed');

    if(userCachedDetails[HASHES.SPINNING_WHEEL.USER.USER_CODE()])
        return {
          hasPlayed: true,
          code: userCachedDetails[HASHES.SPINNING_WHEEL.USER.USER_CODE()]
        }
        
    const code = await this.generateUniqueCode();

    
    const endDate = new Date(isSpinningWheelAvailable.endDate);
    const now = new Date();
    
    const ttlSeconds = Math.floor((endDate.getTime() - now.getTime()) / 1000);
    
    await this.redis.hmset(HASHES.SPINNING_WHEEL.USER.HASH(userId), {
      [HASHES.SPINNING_WHEEL.USER.USER_CODE()]: code,
      [HASHES.SPINNING_WHEEL.USER.USER_REDEEMED_CODE()]: 'false',
      [HASHES.SPINNING_WHEEL.USER.REWARD_ID()]: wheelRewardId
    });
    
    await this.redis.hset(HASHES.SPINNING_WHEEL.CODES(), code, userId);
    
    await this.redis.expire(
        HASHES.SPINNING_WHEEL.USER.HASH(userId),
        ttlSeconds
      );

    await this.redis.expire(
        HASHES.SPINNING_WHEEL.CODES(),
        ttlSeconds
      );

    return {
      hasPlayed: true,
      code: code
    }


  
  }

      

  async redeemCode(code: string): Promise<RedeemCodeResponseDto> {

    const isSpinningWheelAvailable = await this.isSpinningWheelAvailable();

    if (!isSpinningWheelAvailable.isAvailable)
      throw new BadRequestException('Spinning wheel is not available');



    const userId = await this.redis.hget(HASHES.SPINNING_WHEEL.CODES(), code);

    if(!userId)
      throw new BadRequestException('Invalid code, User with this code not found');


    const userCachedDetails = await this.redis.hgetall(HASHES.SPINNING_WHEEL.USER.HASH(userId));


    if(userCachedDetails[HASHES.SPINNING_WHEEL.USER.USER_REDEEMED_CODE()]==='true')
      throw new BadRequestException('Code already redeemed');


    const userRewardId = userCachedDetails[HASHES.SPINNING_WHEEL.USER.REWARD_ID()];


    const isRewardExists = await this.spinnigWheelRewardService.getRewardById(userRewardId);

    if(!isRewardExists.exist)
      throw new BadRequestException('Reward of the code not found');



    await this.redis.hmset(HASHES.SPINNING_WHEEL.USER.HASH(userId), {
      [HASHES.SPINNING_WHEEL.USER.USER_REDEEMED_CODE()]: 'true',
      [HASHES.SPINNING_WHEEL.USER.USER_CODE()]: null
    });


    await this.redis.hdel(HASHES.SPINNING_WHEEL.CODES(), code);

    const rewardName = await this.redis.hget(HASHES.SPINNING_WHEEL.REWARDS.REWARD_NAME(), userRewardId);

    return {
      hasRedeemed: true,
      reward: rewardName as string
    }



  }
  


  async getRewards () {
    const reward = await this.spinnigWheelRewardService.findAll();
    
    return reward;
  }
}
