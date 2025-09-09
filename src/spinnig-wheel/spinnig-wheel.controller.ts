import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { SpinnigWheelService } from './spinnig-wheel.service';
import { CreateSpinnigWheel } from './dto/create-spinnig-wheel.dto';
import { UpdateSpinnigWheelDto } from './dto/update-spinnig-wheel.dto';

@Controller('spinnig-wheel')
export class SpinnigWheelController {
  constructor(private readonly spinnigWheelService: SpinnigWheelService) { }


  @HttpCode(200)
  @Get()
  async getActive() {
    const spinnigWheel = await this.spinnigWheelService.findActive();

    return spinnigWheel;

  };



  @HttpCode(200)
  @Patch()
  async update(@Param('id') id: string, @Body() updateSpinnigWheelDto: UpdateSpinnigWheelDto) {
    const updatedWheel = await this.spinnigWheelService.update(updateSpinnigWheelDto);

    return updatedWheel
  }




}
