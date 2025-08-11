import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionsService } from './subscriptions.service';

@Injectable()
export class SubscriptionsCronService {
  private readonly logger = new Logger(SubscriptionsCronService.name);

  constructor(private readonly subsService: SubscriptionsService) {}

  // svakog dana u 00:30 proveri i osvezi premium flagove
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleDaily() {
    this.logger.log('Running subscriptions daily refresh');
    await this.subsService.refreshUsersPremiumStatus();
  }
}