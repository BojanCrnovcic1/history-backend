import { IsString, IsOptional } from 'class-validator';

export class AddTranslationDto {
  @IsString()
  language: string; // 'sr', 'en', ...
  
  @IsString()
  title: string;
  
  @IsString()
  description: string;

  @IsString()
  year: string;
}
