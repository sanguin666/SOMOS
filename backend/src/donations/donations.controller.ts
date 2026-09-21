import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { DonationsService } from './donations.service.js';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';
import { StripeService } from './stripe.service.js';

@Controller('pois/:poiId/donations')
export class DonationsController {
  constructor(
    private readonly donationsService: DonationsService,
    private readonly configService: ConfigService,
  ) {}

  // Public: mirrors the app's demo donate flow (no payment taken).
  @Post()
  create(@Param('poiId') poiId: string, @Body() dto: CreateDonationDto) {
    return this.donationsService.create(poiId, dto);
  }

  /**
   * Public: starts a gift. Returns either a Stripe checkout URL for the app
   * to open, or `mode: 'demo'` when no Stripe key is configured.
   *
   * Stripe sends the payer back to a page on this same backend, so the URL it
   * redirects to has to be one the payer's phone can reach — the request's own
   * host is right in every setup we have (localhost, LAN IP, or the ngrok
   * domain), with PUBLIC_BASE_URL to override it behind a proxy.
   */
  @Post('checkout')
  startCheckout(
    @Param('poiId') poiId: string,
    @Body() dto: CreateDonationDto,
    @Req() request: Request,
  ) {
    const configured = this.configService.get<string>('PUBLIC_BASE_URL');
    const returnUrlBase = configured ?? `${request.protocol}://${request.get('host')}`;
    return this.donationsService.startCheckout(poiId, dto, returnUrlBase);
  }

  // Public: the app polls this while the payer is on Stripe's page.
  @Get(':donationId/status')
  getStatus(@Param('poiId') poiId: string, @Param('donationId') donationId: string) {
    return this.donationsService.getStatus(poiId, donationId);
  }

  // Individual gift amounts are financial data — admin-only, unlike the
  // other modules' public read endpoints.
  @Get()
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  findForPoi(
    @Param('poiId') poiId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.donationsService.findForPoi(poiId, limit);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  getStats(@Param('poiId') poiId: string) {
    return this.donationsService.getStats(poiId);
  }
}

/**
 * Where Stripe sends the payer once they're done. The app can't be the
 * redirect target itself (Stripe only accepts http/https URLs, not an app's
 * own scheme), so this page just tells them to come back — the app notices
 * the payment on its own by polling.
 */
@Controller('donations')
export class DonationReturnController {
  constructor(private readonly stripeService: StripeService) {}

  /**
   * Public: lets the app say "secure payment" or "demo, no money moves"
   * truthfully, and show amounts in whatever currency the backend charges in.
   */
  @Get('config')
  config(): { paymentsEnabled: boolean; currency: string } {
    return {
      paymentsEnabled: this.stripeService.isConfigured,
      currency: this.stripeService.currency,
    };
  }

  @Get('return')
  @Header('Content-Type', 'text/html; charset=utf-8')
  returnPage(@Query('status') status?: string): string {
    const cancelled = status === 'cancelled';
    const title = cancelled ? 'Payment cancelled' : 'Thank you!';
    const message = cancelled
      ? 'No payment was taken. You can close this page and go back to the app.'
      : 'Your donation went through. You can close this page and go back to the app.';
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
             background: #FBF7F2; color: #2B2724; font-family: system-ui, -apple-system, sans-serif; padding: 24px; }
      main { max-width: 22rem; text-align: center; }
      h1 { font-size: 1.75rem; margin: 0 0 0.75rem; }
      p { font-size: 1.125rem; line-height: 1.5; margin: 0; color: #6B625B; }
    </style>
  </head>
  <body>
    <main>
      <h1>${title}</h1>
      <p>${message}</p>
    </main>
  </body>
</html>`;
  }
}
