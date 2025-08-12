import { IsString, IsOptional, Length, IsInt } from 'class-validator';

export class CreateTimePeriodDto {
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

  @IsOptional()
  @IsInt()
  parentTimePeriodId?: number | null;

  @IsOptional()
  @IsString()
  description?: string | null;
}