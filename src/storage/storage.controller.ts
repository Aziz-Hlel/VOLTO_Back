import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { StorageService } from './storage.service';
import { CreateS3Dto } from './dto/create-s3.dto';
import { UpdateS3Dto } from './dto/update-s3.dto';
import { PreSignedUrlRequest } from './dto/preSignedUrl.dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('s3')
export class StorageController {
  constructor(private readonly s3Service: StorageService) { }

  @Post()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async getPresignedUrl(@Body() preSignedUrlDto: PreSignedUrlRequest) {

    const response = await this.s3Service.getPresignedUrl(preSignedUrlDto);

    return response;
  }


  @Post()
  create(@Body() createS3Dto: CreateS3Dto) {
    return this.s3Service.create(createS3Dto);
  }

  @Get()
  findAll() {
    return this.s3Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.s3Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateS3Dto: UpdateS3Dto) {
    return this.s3Service.update(+id, updateS3Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.s3Service.remove(+id);
  }
}
