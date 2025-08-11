import { IsEnum, IsOptional } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsEnum(['paid', 'pending', 'failed'])
  @IsOptional()
  paymentStatus?: 'paid' | 'pending' | 'failed';
}