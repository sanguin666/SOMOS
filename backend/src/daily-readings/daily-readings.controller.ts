import { Body, Controller, Delete, Get, Param, Patch, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';
import { DailyReadingsService } from './daily-readings.service.js';
import { SaveDailyReadingDto, UpdateReadingsSettingsDto } from './dto/daily-reading.dto.js';

/**
 * Lectures du jour: texts the office prepares, one set per date. Reading
 * them is open like the news; writing them is the office's.
 */
@Controller('pois/:poiId/readings')
export class DailyReadingsController {
  constructor(private readonly service: DailyReadingsService) {}

  @Get()
  list(@Param('poiId') poiId: string, @Query('today') today?: string) {
    return this.service.listPublished(poiId, today);
  }

  @Get('settings')
  settings(@Param('poiId') poiId: string) {
    return this.service.settings(poiId);
  }

  @Patch('settings')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  updateSettings(@Param('poiId') poiId: string, @Body() dto: UpdateReadingsSettingsDto) {
    return this.service.updateSettings(poiId, dto.linkUrl ?? null);
  }

  @Get('manage')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  manage(@Param('poiId') poiId: string, @Query('from') from: string, @Query('to') to: string) {
    return this.service.listForOffice(poiId, from, to);
  }

  @Put(':date')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  save(@Param('poiId') poiId: string, @Param('date') date: string, @Body() dto: SaveDailyReadingDto) {
    return this.service.save(poiId, date, dto);
  }

  @Delete(':date')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  remove(@Param('poiId') poiId: string, @Param('date') date: string) {
    return this.service.remove(poiId, date);
  }
}
