import { IsString, IsNumber } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: string;

  @IsNumber()
  longitude: string;
}
