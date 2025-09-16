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
  BadRequestException,
} from '@nestjs/common';
import { SpinnigWheelService } from './spinnig-wheel.service';
import { UpdateSpinnigWheelDto } from './dto/update-spinnig-wheel.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthUser } from 'src/users/Dto/AuthUser';


@Controller('spinning-wheel')
export class SpinnigWheelController {
  constructor(private readonly spinnigWheelService: SpinnigWheelService) {}

  @UseGuards(JwtAccessGuard)
  @HttpCode(200)
  @Get('')
  async getisActive(@CurrentUser() user: AuthUser) {

    const spinnigWheel = await this.spinnigWheelService.isSpinningWheelAvailable();

    if(!spinnigWheel.isAvailable)
      return spinnigWheel
    
    const user_quota = await this.spinnigWheelService.getQuota(user.id);

    if(user_quota.hasPlayed)
       return {...spinnigWheel,...user_quota}; 

    const rewards = await this.spinnigWheelService.getRewards();

    return {...spinnigWheel,...user_quota ,...rewards};

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



  @UseGuards(JwtAccessGuard)
  @HttpCode(200)
  @Get('get-quota')
  async getQuota(@CurrentUser() user: AuthUser) {

    const spinnigWheel = await this.spinnigWheelService.getQuota(user.id);

    return spinnigWheel;
  }


  @UseGuards(JwtAccessGuard)
  @HttpCode(200)
  @Post('generate-code')
  async generateCode(@CurrentUser() user: AuthUser, @Body() payload:  {wheelRewardId:string}) {
    
    const response = await this.spinnigWheelService.generateCode({userId: user.id, wheelRewardId: payload.wheelRewardId});

    return response;

  }

  

  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(Role.WAITER)
  @HttpCode(200)
  @Post('redeem-code')
  async redeemCode(@CurrentUser() user: AuthUser, @Body() payload:  {code:string}) {

    if(!payload.code) throw new BadRequestException('Code is required');

    const response = await this.spinnigWheelService.redeemCode(payload.code);

    return response;

  };






}
