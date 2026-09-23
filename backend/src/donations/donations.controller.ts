import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Header,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { DonationsService } from './donations.service.js';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto.js';
import {
  JwtAuthGuard,
  OptionalJwtAuthGuard,
  type AuthenticatedRequest,
  type MaybeAuthenticatedRequest,
} from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';
import { StripeService } from './stripe.service.js';
import { SignedUrlService } from '../common/signed-url/signed-url.service.js';
import { PoisService } from '../pois/pois.service.js';
import { decodeDonorKey, donorsCsv, encodeDonorKey, receiptHtml } from './receipts.js';

function parseYear(value: string | undefined): number {
  const year = Number(value ?? new Date().getFullYear());
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    throw new BadRequestException('Not a year');
  }
  return year;
}

/** Where Stripe sends the payer back to — see startCheckout below. */
export function returnUrlBase(configService: ConfigService, request: Request): string {
  return configService.get<string>('PUBLIC_BASE_URL') ?? `${request.protocol}://${request.get('host')}`;
}

function receiptPath(poiId: string, year: number, encodedKey: string): string {
  return `/receipts/${poiId}/${year}/${encodedKey}`;
}

function exportPath(poiId: string, year: number): string {
  return `/receipts/${poiId}/${year}/export`;
}

@Controller('pois/:poiId/donations')
export class DonationsController {
  constructor(
    private readonly donationsService: DonationsService,
    private readonly configService: ConfigService,
    private readonly signedUrls: SignedUrlService,
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
  @UseGuards(OptionalJwtAuthGuard)
  startCheckout(
    @Param('poiId') poiId: string,
    @Body() dto: CreateDonationDto,
    @Req() request: MaybeAuthenticatedRequest,
  ) {
    return this.donationsService.startCheckout(poiId, dto, returnUrlBase(this.configService, request), {
      donorUserId: request.userId,
    });
  }

  // ---- The signed-in giver's own ----

  @Get('mine/monthly')
  @UseGuards(JwtAuthGuard)
  myMonthly(@Param('poiId') poiId: string, @Req() request: AuthenticatedRequest) {
    return this.donationsService.listMyMonthly(poiId, request.userId);
  }

  @Post('mine/monthly/:donationId/stop')
  @UseGuards(JwtAuthGuard)
  async stopMonthly(
    @Param('poiId') poiId: string,
    @Param('donationId') donationId: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.donationsService.stopMonthly(poiId, donationId, request.userId);
  }

  // One entry per year with receipt-worthy gifts, each with a link to
  // that year's receipt that opens in the phone's browser.
  @Get('mine/receipts')
  @UseGuards(JwtAuthGuard)
  async myReceipts(@Param('poiId') poiId: string, @Req() request: AuthenticatedRequest) {
    const years = await this.donationsService.myReceiptYears(poiId, request.userId);
    const key = encodeDonorKey(`u:${request.userId}`);
    return years.map(({ year, total }) => ({
      year,
      total,
      url: this.signedUrls.sign(receiptPath(poiId, year, key)),
    }));
  }

  // ---- The office's tax receipts ----

  @Get('receipts')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  async receipts(@Param('poiId') poiId: string, @Query('year') yearParam?: string) {
    const year = parseYear(yearParam);
    const donors = await this.donationsService.receiptDonors(poiId, year);
    return {
      year,
      exportUrl: this.signedUrls.sign(exportPath(poiId, year)),
      donors: donors.map((donor) => {
        const key = encodeDonorKey(donor.key);
        return { ...donor, key, url: this.signedUrls.sign(receiptPath(poiId, year, key)) };
      }),
    };
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
 * Projects a community raises money for. Reading the open ones is public,
 * like the rest of a place's content; everything else is the office's.
 */
@Controller('pois/:poiId/campaigns')
export class CampaignsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Get()
  listOpen(@Param('poiId') poiId: string) {
    return this.donationsService.listCampaigns(poiId, false);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  listAll(@Param('poiId') poiId: string) {
    return this.donationsService.listCampaigns(poiId, true);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  create(@Param('poiId') poiId: string, @Body() dto: CreateCampaignDto) {
    return this.donationsService.createCampaign(poiId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  update(@Param('poiId') poiId: string, @Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.donationsService.updateCampaign(poiId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  remove(@Param('poiId') poiId: string, @Param('id') id: string) {
    return this.donationsService.removeCampaign(poiId, id);
  }
}

/**
 * A receipt, or the year's list of givers, opened from a signed link (see
 * SignedUrlService): the dashboard and the app hand these out only after
 * checking who is asking, and the browser tab they open in can't carry a
 * login of its own.
 */
@Controller('receipts')
export class ReceiptsController {
  constructor(
    private readonly donationsService: DonationsService,
    private readonly poisService: PoisService,
    private readonly stripeService: StripeService,
    private readonly signedUrls: SignedUrlService,
  ) {}

  @Get(':poiId/:year/export')
  async export(
    @Param('poiId') poiId: string,
    @Param('year') yearParam: string,
    @Query('exp') exp: string | undefined,
    @Query('sig') sig: string | undefined,
    @Res() response: Response,
  ): Promise<void> {
    const year = parseYear(yearParam);
    if (!this.signedUrls.verify(exportPath(poiId, year), exp, sig)) {
      throw new ForbiddenException('This link has expired');
    }
    const donors = await this.donationsService.receiptDonors(poiId, year);
    response.setHeader('Content-Type', 'text/csv; charset=utf-8');
    response.setHeader('Content-Disposition', `attachment; filename="donors-${year}.csv"`);
    response.send(donorsCsv(donors));
  }

  @Get(':poiId/:year/:key')
  @Header('Content-Type', 'text/html; charset=utf-8')
  @Header('Cache-Control', 'private, no-store')
  async receipt(
    @Param('poiId') poiId: string,
    @Param('year') yearParam: string,
    @Param('key') encodedKey: string,
    @Query('exp') exp: string | undefined,
    @Query('sig') sig: string | undefined,
  ): Promise<string> {
    const year = parseYear(yearParam);
    if (!this.signedUrls.verify(receiptPath(poiId, year, encodedKey), exp, sig)) {
      throw new ForbiddenException('This link has expired');
    }
    const donor = await this.donationsService.receiptDonor(poiId, year, decodeDonorKey(encodedKey));
    if (!donor) throw new NotFoundException('No gifts to receipt');
    const poi = await this.poisService.findOne(poiId);
    return receiptHtml(poi, donor, year, this.stripeService.currency);
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
