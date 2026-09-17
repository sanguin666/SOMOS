import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { DonationsService } from './donations.service.js';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';

@Controller('pois/:poiId/donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  // Public: mirrors the app's demo donate flow (no payment processor yet).
  @Post()
  create(@Param('poiId') poiId: string, @Body() dto: CreateDonationDto) {
    return this.donationsService.create(poiId, dto);
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
