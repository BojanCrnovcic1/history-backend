import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadMediaDto {
  @IsEnum(['image', 'video'])
  mediaType: 'image' | 'video';

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  eventId?: number;
}