import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSpinnigWheel } from './dto/create-spinnig-wheel.dto';
import { UpdateSpinnigWheelDto } from './dto/update-spinnig-wheel.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SpinnigWheelService {
  constructor(private readonly prisma: PrismaService) {}

  

  async isSpinningWheelAvailable() {
    const spinnigWheel = await this.prisma.spinningWheel.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!spinnigWheel) throw new InternalServerErrorException('No active spinnig wheel instance found');

    const currentDate = new Date();

    if (
      spinnigWheel.startDate > currentDate ||
      spinnigWheel.endDate < currentDate
    )
      return null;

    return spinnigWheel;

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

  findActive = async () => {
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

    const updatedWheel = await this.prisma.spinningWheel.update({
      where: {
        id: updateSpinnigWheelDto.id,
      },
      data: {
        name: updateSpinnigWheelDto.name,
        startDate: updateSpinnigWheelDto.startDate,
        endDate: updateSpinnigWheelDto.endDate,
        isActive: true,
      },
    });
    return updatedWheel;
  };
}
