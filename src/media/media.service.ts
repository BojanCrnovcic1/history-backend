import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/entities/media.entity';
import { Repository } from 'typeorm';
import { UploadMediaDto } from './dto/upload.media.dto';
import { Events } from 'src/entities/events.entity';
import { ApiResponse } from 'src/misc/api.response.class';


@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    @InjectRepository(Events) private readonly eventRepo: Repository<Events>,
  ) {}

  async upload(dto: UploadMediaDto): Promise<ApiResponse> {
    const media = this.mediaRepo.create(dto);

    if (dto.eventId) {
      const event = await this.eventRepo.findOne({ where: { eventId: dto.eventId } });
      if (!event) {
        return new ApiResponse('error', -1001, 'Associated event not found.');
      }
      media.event = event;
    }

    await this.mediaRepo.save(media);
    return new ApiResponse('success', 201, 'Media uploaded.');
  }

  async delete(mediaId: number): Promise<ApiResponse> {
    const media = await this.mediaRepo.findOne({ where: { mediaId } });
    if (!media) {
      return new ApiResponse('error', -1002, 'Media not found.');
    }

    await this.mediaRepo.remove(media);
    return new ApiResponse('success', 200, 'Media deleted.');
  }

  async getAllByEvent(eventId: number): Promise<Media[] | ApiResponse> {
    const event = await this.eventRepo.findOne({ where: { eventId }, relations: ['media'] });
    if (!event) {
      return new ApiResponse('error', -2001, 'Event not found!');
    }
    return event.media;
  }
}
