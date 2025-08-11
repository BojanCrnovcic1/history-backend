// src/webhook/webhook.controller.ts
import { Controller, Post, Req, Res, HttpCode, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly webhookService: WebhookService) {}

  @Post('paypal')
  @HttpCode(200)
  async handlePaypalWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      const verified = await this.webhookService.verifyWebhook(req);
      if (!verified) {
        this.logger.warn('Invalid PayPal webhook signature');
        return res.status(400).send('Invalid signature');
      }

      await this.webhookService.processEvent(req.body);

      return res.send({ received: true });
    } catch (error) {
      this.logger.error(`Error processing PayPal webhook: ${error.message}`, error.stack);
      return res.status(500).send('Internal Server Error');
    }
  }
}


