import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddTranslationDto } from './add.translation.dto';


export class CreateEventDto {
  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsNumber()
  locationId?: number;

  @IsOptional()
  @IsNumber()
  eventTypeId?: number;

  @IsOptional()
  @IsNumber()
  timePeriodId?: number;

  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddTranslationDto)
  translations: AddTranslationDto[];
}
