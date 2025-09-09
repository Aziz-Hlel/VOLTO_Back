import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { PreSignedUrlRequest } from 'src/storage/dto/preSignedUrl.dto';
import { PreSignedUrlResponse } from 'src/storage/dto/PreSignedUrlResponse';
import { JwtAccessGuard } from 'src/auth/guards/jwt.guard';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('presigned-url')
  @HttpCode(200)
  @UseGuards(JwtAccessGuard)
  async getPresignedUrl(
    @Body() preSignedUrlDto: PreSignedUrlRequest,
  ): Promise<PreSignedUrlResponse> {
    const response = await this.mediaService.getPresignedUrl(preSignedUrlDto);

    return response;
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.mediaService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
  //   return this.mediaService.update(+id, updateMediaDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
