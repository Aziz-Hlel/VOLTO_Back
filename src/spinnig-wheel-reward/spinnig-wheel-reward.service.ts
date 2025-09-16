import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpinnigWheelRewardDto } from './dto/create-spinnig-wheel-reward.dto';
import { UpdateSpinnigWheelRewardDto } from './dto/update-spinnig-wheel-reward.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpinnigWheelService } from 'src/spinnig-wheel/spinnig-wheel.service';
import Redis from 'ioredis';
import { HASHES } from 'src/redis/hashes';

@Injectable()
export class SpinnigWheelRewardService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => SpinnigWheelService))
    private readonly spinnigWheelService: SpinnigWheelService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  create = async (createSpinnigWheelRewardDto: CreateSpinnigWheelRewardDto) => {
    const spinnigWheel = await this.spinnigWheelService.getWheel();

    if (!spinnigWheel)
      throw new InternalServerErrorException(
        'No active spinnig wheel found, please create one first before adding rewards.',
      );

    if (spinnigWheel.rewardList.length > 5)
      throw new InternalServerErrorException(
        'Number of rewards reached more than the maximus which is 5.',
      );

    if (spinnigWheel.rewardList.length === 5)
      throw new BadRequestException(
        'Number of rewards reached the maximus which is 5.',
      );

    const createdAward = await this.prisma.spinningWheelReward.create({
      data: { ...createSpinnigWheelRewardDto, wheelId: spinnigWheel.id },
    });

    return createdAward;
  };

  findAll = async () => {
    const rewardsList = await this.prisma.spinningWheelReward.findMany({ take: 5 });

    return {rewardsList};
  };



  update = async (updateSpinningWheelRewardDto: UpdateSpinnigWheelRewardDto) => {

    const rewardIds = updateSpinningWheelRewardDto.rewards.map(r => r.id);

    const existingRewards = await this.prisma.spinningWheelReward.findMany({
    where: { id: { in: rewardIds } },
    select: { id: true },
  });

    const existingIds = existingRewards.map(r => r.id);
    const invalidIds = rewardIds.filter(id => !existingIds.includes(id));

    if (invalidIds.length > 0) {
      throw new BadRequestException(`Invalid reward IDs: ${invalidIds.join(', ')}`);
    }


    try {
      const awards = await this.prisma.$transaction(
        updateSpinningWheelRewardDto.rewards.map((reward) =>
          this.prisma.spinningWheelReward.update({
            where: {
              id: reward.id,
            },
            data: { name: reward.name },
          }),
        ),
      );

      await this.updateRewardsCache(awards);

      return awards;

    } catch (err) {
      throw new Error(err);
    }
  };




  async getRewardById(rewardId: string):Promise<{exist:false,} | {exist:true,rewardName:string} > {


   const rewardName =await this.redis.hget(HASHES.SPINNING_WHEEL.REWARDS.REWARD_NAME(),rewardId);

    if(!rewardName) return {exist: false};

    return {exist:true, rewardName}

  }


  async updateRewardsCache(rewardsList: {id:string; name: string}[]){

    const dic : Record<string, string>= {};

    rewardsList.map(reward => dic[reward.id] = reward.name);

    await this.redis.hmset(HASHES.SPINNING_WHEEL.REWARDS.REWARD_NAME(),dic);

  }

}
