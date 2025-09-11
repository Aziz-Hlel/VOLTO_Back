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
import { ActiveSpinningWheelResponse as ActiveSpinningWheelResponse, UnactiveSpinningWheelResponse } from './dto/active-spinning-wheel.dto';

@Injectable()
export class SpinnigWheelService {
  constructor(private readonly prisma: PrismaService,
     @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  
  async updateWheelCache(): Promise<ActiveSpinningWheelResponse | UnactiveSpinningWheelResponse> {
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
    isAvailable: false
  };

    return {
      name: spinnigWheel.name,
      startDate: spinnigWheel.startDate,
      endDate: spinnigWheel.endDate,
      isAvailable: true
    };
  }

  async isSpinningWheelAvailable(): Promise<ActiveSpinningWheelResponse | UnactiveSpinningWheelResponse>{

    let [strStartDate, strEndDate, spinnigWheelName] = await this.redis.hmget(
      HASHES.SPINNING_WHEEL.DATE.HASH(),
      HASHES.SPINNING_WHEEL.DATE.START_DATE(),
      HASHES.SPINNING_WHEEL.DATE.END_DATE(),
      HASHES.SPINNING_WHEEL.DATE.NAME(),
    )

    if (!strStartDate || !strEndDate || !spinnigWheelName) return  await this.updateWheelCache();

    const currentDate = new Date();
    
    const startDate = new Date(strStartDate);
    const endDate = new Date(strEndDate);

    if ( currentDate < startDate  || currentDate > endDate )
      return {
        isAvailable: false
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
  

  update = async (updateSpinnigWheelDto: UpdateSpinnigWheelDto) => {
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

    return updatedWheel;
  };





  async getQuota(userId: string){
    const user =await this.redis.hgetall(HASHES.SPINNING_WHEEL.USER.HASH(userId));
    if(Object.keys(user).length === 0 )
      return 0;
  }
}
