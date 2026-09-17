import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PrayerRequestsService } from './prayer-requests.service.js';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';

@Controller('pois/:poiId/prayer-requests')
export class PrayerRequestsController {
  constructor(
    private readonly prayerRequestsService: PrayerRequestsService,
  ) {}

  @Post()
  create(
    @Param('poiId') poiId: string,
    @Body() dto: CreatePrayerRequestDto,
  ) {
    return this.prayerRequestsService.create(poiId, dto);
  }

  @Get()
  findForPoi(@Param('poiId') poiId: string) {
    return this.prayerRequestsService.findForPoi(poiId);
  }

  @Post(':id/pray')
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
