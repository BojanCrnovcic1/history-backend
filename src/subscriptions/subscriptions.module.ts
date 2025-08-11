import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Subscriptions } from 'src/entities/subscriptions.entity';
import { Users } from 'src/entities/users.entity';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PaymentService } from './payment.service';
import { SubscriptionsCronService } from './cron.service';
import { PaymentController } from './payment.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Subscriptions, Users]), ConfigModule],
  providers: [SubscriptionsService, PaymentService, SubscriptionsCronService],
  controllers: [SubscriptionsController, PaymentController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}

