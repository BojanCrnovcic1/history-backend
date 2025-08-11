// src/webhook/webhook.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private paypalBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.paypalBaseUrl = this.configService.get<string>('PAYPAL_API_URL') || 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const res = await axios.post(
      `${this.paypalBaseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return res.data.access_token;
  }

  async verifyWebhook(req: any): Promise<boolean> {
    const accessToken = await this.getAccessToken();

    try {
      const res = await axios.post(
        `${this.paypalBaseUrl}/v1/notifications/verify-webhook-signature`,
        {
          auth_algo: req.headers['paypal-auth-algo'],
          cert_url: req.headers['paypal-cert-url'],
          transmission_id: req.headers['paypal-transmission-id'],
          transmission_sig: req.headers['paypal-transmission-sig'],
          transmission_time: req.headers['paypal-transmission-time'],
          webhook_id: this.configService.get<string>('PAYPAL_WEBHOOK_ID'),
          webhook_event: req.body,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return res.data.verification_status === 'SUCCESS';
    } catch (error) {
      this.logger.error(`Webhook verification failed: ${error.message}`);
      return false;
    }
  }

  async processEvent(event: any) {
    this.logger.log(`Processing PayPal webhook event: ${event.event_type}`);

    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        // update subscription in DB to active
        break;

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // update subscription in DB to cancelled
        break;

      case 'BILLING.SUBSCRIPTION.EXPIRED':
        // update subscription in DB to expired
        break;

      default:
        this.logger.debug(`Unhandled PayPal event: ${event.event_type}`);
    }
  }
}
