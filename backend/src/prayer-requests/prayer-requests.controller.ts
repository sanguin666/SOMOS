import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrayerRequestsService } from './prayer-requests.service.js';
import { CreatePrayerRequestDto } from './dto/create-prayer-request.dto.js';

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
}
