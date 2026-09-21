import { BadRequestException, Controller, Headers, Logger, Post, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import type Stripe from 'stripe';
import { DonationsService } from './donations.service.js';
import { StripeService } from './stripe.service.js';

/**
 * Stripe's own notification that a payment finished. Optional: it needs a
 * publicly reachable URL and STRIPE_WEBHOOK_SECRET, neither of which the
 * local demo has, and the app confirms payments by polling regardless. It's
 * here so a deployed backend records gifts even if the payer closes the app
 * mid-payment.
 */
@Controller('stripe')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly donationsService: DonationsService,
  ) {}

  @Post('webhook')
  async handle(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature?: string,
  ): Promise<{ received: boolean }> {
    if (!this.stripeService.isConfigured || !signature || !request.rawBody) {
      throw new BadRequestException('Stripe webhooks are not configured');
    }

    let event: Stripe.Event | null;
    try {
      event = this.stripeService.constructWebhookEvent(request.rawBody, signature);
    } catch (error) {
      // A bad signature means the caller isn't Stripe — never trust the body.
      this.logger.warn(`Rejected a Stripe webhook: ${(error as Error).message}`);
      throw new BadRequestException('Invalid Stripe signature');
    }
    if (!event) throw new BadRequestException('Stripe webhooks are not configured');

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const donation = await this.donationsService.findBySessionId(session.id);
      if (donation) {
        await this.donationsService.applySessionOutcome(
          donation,
          session.payment_status,
          session.status,
          session.payment_intent,
        );
      }
    }

    return { received: true };
  }
}
