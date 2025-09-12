import { IsString } from "class-validator";

export class TimePeriodTranslationDto {
  @IsString()
  language: string; // "sr" ili "en"

  @IsString()
  name: string;

  @IsString()
  startYear: string;

  @IsString()
  endYear: string;

  @IsString()
  description: string;
}
