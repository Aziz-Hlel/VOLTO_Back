import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSpinnigWheelDto } from './dto/create-spinnig-wheel.dto';
import { UpdateSpinnigWheelDto } from './dto/update-spinnig-wheel.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SpinnigWheelService {

  constructor(private readonly prisma: PrismaService) { }


  create(createSpinnigWheelDto: CreateSpinnigWheelDto) {
    return 'This action adds a new spinnigWheel';
  }



  findActive = async () => {
    const spinnigWheel = await this.prisma.spinningWheel.findFirst({
      where: {
        isActive: true
      },
      include: {
        rewardList: true
      }
    })
    if (!spinnigWheel)
      throw new InternalServerErrorException('No active spinnig wheel found');

    return spinnigWheel;

  }

  update = async (updateSpinnigWheelDto: UpdateSpinnigWheelDto) => {
    const spinnigWheel = await this.prisma.spinningWheel.findFirst({
      where: {
        id: updateSpinnigWheelDto.id,
        isActive: true

      }
    })
    if (!spinnigWheel)
      throw new BadRequestException('No active spinnig wheel found with this id');

    const updatedWheel = await this.prisma.spinningWheel.update({
      where: {
        id: updateSpinnigWheelDto.id
      },
      data: {
        name: updateSpinnigWheelDto.name,
        startDate: updateSpinnigWheelDto.startDate,
        endDate: updateSpinnigWheelDto.endDate,
        isActive: true
      }
      }
    )
    return updatedWheel
  }


}
