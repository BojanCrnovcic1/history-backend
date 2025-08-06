import {
    IsString,
    IsOptional,
    IsNumber,
    IsArray,
    ValidateNested,
    IsBoolean,
    IsEnum,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateEventDto {
    @IsString()
    title: string;
  
    @IsString()
    description: string;
  
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
  
  }
  