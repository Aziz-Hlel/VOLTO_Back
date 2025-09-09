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
import { StorageService } from './storage.service';
import { CreateS3Dto } from './dto/create-s3.dto';
import { UpdateS3Dto } from './dto/update-s3.dto';
import { PreSignedUrlRequest } from './dto/preSignedUrl.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt.guard';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presigned-url')
  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  async getPresignedUrl(@Body() preSignedUrlDto: PreSignedUrlRequest) {
    const response = await this.storageService.getPresignedUrl(preSignedUrlDto);

    return response;
  }

  @Post()
  create(@Body() createS3Dto: CreateS3Dto) {
    return this.storageService.create(createS3Dto);
  }

  @Get()
  findAll() {
    return this.storageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateS3Dto: UpdateS3Dto) {
    return this.storageService.update(+id, updateS3Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageService.remove(+id);
  }
}
