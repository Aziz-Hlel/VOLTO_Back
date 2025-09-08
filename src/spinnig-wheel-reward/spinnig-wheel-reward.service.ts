import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSpinnigWheelRewardDto } from './dto/create-spinnig-wheel-reward.dto';
import { UpdateSpinnigWheelRewardDto } from './dto/update-spinnig-wheel-reward.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpinnigWheelService } from 'src/spinnig-wheel/spinnig-wheel.service';

@Injectable()
export class SpinnigWheelRewardService {

  constructor(private readonly prisma: PrismaService, private readonly spinnigWheelService: SpinnigWheelService) { }

  create = async (createSpinnigWheelRewardDto: CreateSpinnigWheelRewardDto) => {
    const spinnigWheel = await this.spinnigWheelService.findActive();

    if (!spinnigWheel)
      throw new InternalServerErrorException('No active spinnig wheel found, please create one first before adding rewards.');

    if (spinnigWheel.rewardList.length > 5)
      throw new InternalServerErrorException(' Number of rewards reached more than the maximus which is 5.');

    if (spinnigWheel.rewardList.length === 5)
      throw new BadRequestException(' Number of rewards reached the maximus which is 5.');

    const createdAward = await this.prisma.spinningWheelReward.create({
      data: { ...createSpinnigWheelRewardDto, wheelId: spinnigWheel.id }
    });

    return createdAward

  }


  findAll = async () => {
    const awards = await this.prisma.spinningWheelReward.findMany();

    return awards
  }

  findOne(id: number) {
    return `This action returns a #${id} spinnigWheelReward`;
  }

  update = async (updateSpinnigWheelRewardDto: UpdateSpinnigWheelRewardDto) => {
    const award = await this.prisma.spinningWheelReward.findUnique({ where: { id: updateSpinnigWheelRewardDto.id } });

    if (!award)
      throw new NotFoundException('award not found');

    const updatedAward = await this.prisma.spinningWheelReward.update({ where: { id: updateSpinnigWheelRewardDto.id }, data: updateSpinnigWheelRewardDto });

    return updatedAward
  }

  remove(id: number) {
    return `This action removes a #${id} spinnigWheelReward`;
  }
}
