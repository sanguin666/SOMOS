import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  JwtAuthGuard,
  OptionalJwtAuthGuard,
  type AuthenticatedRequest,
  type MaybeAuthenticatedRequest,
} from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';
import { returnUrlBase } from '../donations/donations.controller.js';
import { MassIntentionsService } from './mass-intentions.service.js';
import {
  CreateMassIntentionDto,
  CreateOfficeMassIntentionDto,
  UpdateMassIntentionDto,
  UpdateMassIntentionSettingsDto,
} from './dto/mass-intention.dto.js';

/**
 * Mass intentions. Asking for one is open to anyone, like giving: an
 * elderly member should not need an account to have a Mass said for their
 * late husband. Signing in only remembers it against their account.
 */
@Controller('pois/:poiId/mass-intentions')
export class MassIntentionsController {
  constructor(
    private readonly service: MassIntentionsService,
    private readonly configService: ConfigService,
  ) {}

  @Get('settings')
  settings(@Param('poiId') poiId: string) {
    return this.service.settings(poiId);
  }

  @Patch('settings')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  updateSettings(@Param('poiId') poiId: string, @Body() dto: UpdateMassIntentionSettingsDto) {
    return this.service.updateSettings(poiId, dto.offeringAmount);
  }

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(
    @Param('poiId') poiId: string,
    @Body() dto: CreateMassIntentionDto,
    @Req() request: MaybeAuthenticatedRequest,
  ) {
    return this.service.create(poiId, dto, returnUrlBase(this.configService, request), request.userId);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  mine(@Param('poiId') poiId: string, @Req() request: AuthenticatedRequest) {
    return this.service.listMine(poiId, request.userId);
  }

  // Public, like a gift's status: the id is only known to whoever asked.
  @Get(':id/status')
  status(@Param('poiId') poiId: string, @Param('id') id: string) {
    return this.service.status(poiId, id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  list(@Param('poiId') poiId: string, @Query('filter') filter?: string) {
    return this.service.listForStaff(poiId, filter === 'all' ? 'all' : 'upcoming');
  }

  @Post('office')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  createAtOffice(@Param('poiId') poiId: string, @Body() dto: CreateOfficeMassIntentionDto) {
    return this.service.createAtOffice(poiId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  update(@Param('poiId') poiId: string, @Param('id') id: string, @Body() dto: UpdateMassIntentionDto) {
    return this.service.update(poiId, id, dto);
  }
}
