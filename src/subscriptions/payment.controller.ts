import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateSubscriptionDto } from './dto/create.subscription.dto';


@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('paypal/create-subscription')
  async createPaypalSubscription(@Body() dto: CreateSubscriptionDto) {
    return this.paymentService.createSubscription(dto.userId, dto.type);
  }
}
