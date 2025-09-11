import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { SpinnigWheelService } from './spinnig-wheel.service';
import { CreateSpinnigWheel } from './dto/create-spinnig-wheel.dto';
import { UpdateSpinnigWheelDto } from './dto/update-spinnig-wheel.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';


@Controller('spinnig-wheel')
export class SpinnigWheelController {
  constructor(private readonly spinnigWheelService: SpinnigWheelService) {}

  @UseGuards(JwtAccessGuard)
  @HttpCode(200)
  @Get('')
  async getisActive() {

    const spinnigWheel = await this.spinnigWheelService.isSpinningWheelAvailable();

    return spinnigWheel;
  }



  @UseGuards(JwtAccessGuard,RolesGuard)
  @Roles(Role.ADMIN,Role.SUPER_ADMIN)
  @HttpCode(200)
  @Get('admin/instance')
  async adminGetSpinnigWheel() {

    const spinnigWheel = await this.spinnigWheelService.getWheel();

    return spinnigWheel;
  }

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.ADMIN,Role.SUPER_ADMIN)
  @HttpCode(200)
  @Patch('admin/instance')
  async update(
    @Param('id') id: string,
    @Body() updateSpinnigWheelDto: UpdateSpinnigWheelDto,
  ) {
    const updatedWheel = await this.spinnigWheelService.update(
      updateSpinnigWheelDto,
    );

    return updatedWheel;
  };



}
