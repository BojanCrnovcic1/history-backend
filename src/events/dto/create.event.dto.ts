import {
    IsString,
    IsOptional,
    IsNumber,
    IsBoolean,
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
  