import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { PaymentService } from './payment.service';
import { CreateSubscriptionDto } from './dto/create.subscription.dto';
import { UpdateSubscriptionDto } from './dto/update.subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subsService: SubscriptionsService, private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() dto: CreateSubscriptionDto) {
    return this.subsService.create(dto);
  }

  @Get()
  findAll() {
    return this.subsService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.subsService.findByUser(Number(userId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    return this.subsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subsService.remove(Number(id));
  }

  @Post(':id/mark-paid')
  markPaid(@Param('id') id: string) {
    return this.subsService.markAsPaid(Number(id));
  }
}
