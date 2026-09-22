import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PrayerRequestsService } from './prayer-requests.service.js';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto.js';
import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';

@Controller('pois/:poiId/prayer-requests')
export class PrayerRequestsController {
  constructor(
    private readonly prayerRequestsService: PrayerRequestsService,
  ) {}

  // Any signed-in member can share an intention — unlike announcements,
  // which are the parish speaking and are admin-only. Reading needs no
  // account at all; removing an intention is moderation, so admin-only.
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Req() request: AuthenticatedRequest,
    @Param('poiId') poiId: string,
    @Body() dto: CreatePrayerRequestDto,
  ) {
    return this.prayerRequestsService.create(poiId, request.userId, dto);
  }

  @Get()
  findForPoi(@Param('poiId') poiId: string) {
    return this.prayerRequestsService.findForPoi(poiId);
  }

  // A session, but nothing more: an open counter is one script away from
  // meaningless.
  @Post(':id/pray')
  @UseGuards(JwtAuthGuard)
  pray(@Param('id') id: string) {
    return this.prayerRequestsService.pray(id);
  }

  // Moderation: an admin removing an inappropriate or resolved request.
  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  remove(@Param('poiId') poiId: string, @Param('id') id: string) {
    return this.prayerRequestsService.remove(poiId, id);
  }
}
