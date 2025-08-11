import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private paypalBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.paypalBaseUrl = this.configService.get<string>('PAYPAL_API_URL') || 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new InternalServerErrorException('PayPal API keys are not configured');
    }

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await axios.post(
      `${this.paypalBaseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  }

  async createSubscription(userId: number, type: 'monthly' | 'yearly') {
    const accessToken = await this.getAccessToken();
    const planId =
      type === 'monthly'
        ? this.configService.get<string>('PAYPAL_MONTHLY_PLAN_ID')
        : this.configService.get<string>('PAYPAL_YEARLY_PLAN_ID');

    if (!planId) throw new InternalServerErrorException('PayPal plan ID not configured');

    const subscriptionData = {
      plan_id: planId,
      application_context: {
        brand_name: 'HistoryApp',
        locale: 'BA',
        user_action: 'SUBSCRIBE_NOW',
        return_url: `${this.configService.get<string>('BACKEND_URL')}/payment-success`,
        cancel_url: `${this.configService.get<string>('BACKEND_URL')}/payment-cancel`,
      },
    };

    const response = await axios.post(
      `${this.paypalBaseUrl}/v1/billing/subscriptions`,
      subscriptionData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    this.logger.log(`Created PayPal subscription for user ${userId}, link: ${response.data.links[0].href}`);
    return {
      approvalUrl: response.data.links.find((link) => link.rel === 'approve')?.href,
      subscriptionId: response.data.id,
    };
  }
}
