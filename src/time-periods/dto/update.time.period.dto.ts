import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateTimePeriodDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  startYear?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  endYear?: string;
}