import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNumber()
  userId: number;

  @IsEnum(['monthly', 'yearly'])
  type: 'monthly' | 'yearly';
}