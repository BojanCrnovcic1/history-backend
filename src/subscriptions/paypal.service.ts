// paypal.service.ts
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

@Injectable()
export class PaypalService {
  private environment: any;
  private client: any;
  private readonly logger = new Logger(PaypalService.name);

  constructor() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const isLive = process.env.PAYPAL_MODE === 'live'; // 'sandbox' ili 'live'

    if (!clientId || !clientSecret) {
      throw new InternalServerErrorException('PayPal credentials not set');
    }

    this.environment = isLive
      ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
      : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);

    this.client = new checkoutNodeJssdk.core.PayPalHttpClient(this.environment);
  }

  async verifyWebhookEvent(headers: Record<string, string>, body: any): Promise<boolean> {
    try {
      const request = new checkoutNodeJssdk.notifications.VerifyWebhookSignatureRequest();
      request.requestBody({
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,  // ID tvog webhook-a iz PayPala
        webhook_event: body,
      });

      const response = await this.client.execute(request);

      if (response.result.verification_status === 'SUCCESS') {
        this.logger.log('PayPal webhook verification succeeded');
        return true;
      } else {
        this.logger.warn('PayPal webhook verification failed');
        return false;
      }
    } catch (error) {
      this.logger.error('Error verifying PayPal webhook', error);
      return false;
    }
  }
}
