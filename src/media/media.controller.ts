import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload.media.dto';
import { ApiResponse } from 'src/misc/api.response.class';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';


@Controller('api/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadMediaDto,
  ): Promise<ApiResponse> {
    // Dodaj URL generisan iz uploadovanog fajla
    body.url = `/${file.filename}`;

    return await this.mediaService.upload(body);
  }

  @Delete(':mediaId')
  async delete(@Param('mediaId') mediaId: number): Promise<ApiResponse> {
    return await this.mediaService.delete(mediaId);
  }

  @Get('/event/:eventId')
  async getByEvent(@Param('eventId') eventId: number) {
    return await this.mediaService.getAllByEvent(eventId);
  }
}
