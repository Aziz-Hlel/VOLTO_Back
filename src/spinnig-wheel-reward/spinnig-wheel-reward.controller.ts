import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpinnigWheelRewardService } from './spinnig-wheel-reward.service';
import { CreateSpinnigWheelRewardDto } from './dto/create-spinnig-wheel-reward.dto';
import { UpdateSpinnigWheelRewardDto } from './dto/update-spinnig-wheel-reward.dto';

@Controller('spinnig-wheel-reward')
export class SpinnigWheelRewardController {
  constructor(private readonly spinnigWheelRewardService: SpinnigWheelRewardService) { }



  @Get()
  findAll() {
    return this.spinnigWheelRewardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spinnigWheelRewardService.findOne(+id);
  }

  @Patch()
  async update(@Param('id') id: string, @Body() updateSpinnigWheelRewardDto: UpdateSpinnigWheelRewardDto) {
    const updatedReward = await this.spinnigWheelRewardService.update(updateSpinnigWheelRewardDto);

    return updatedReward
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spinnigWheelRewardService.remove(+id);
  }
}
