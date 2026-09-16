import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LivestreamsService } from './livestreams.service.js';
import { CreateLivestreamDto } from './dto/create-livestream.dto.js';

@Controller('pois/:poiId/livestreams')
export class LivestreamsController {
  constructor(private readonly livestreamsService: LivestreamsService) {}

  @Post()
  create(@Param('poiId') poiId: string, @Body() dto: CreateLivestreamDto) {
    return this.livestreamsService.create(poiId, dto);
  }

  @Get()
  findForPoi(@Param('poiId') poiId: string) {
    return this.livestreamsService.findForPoi(poiId);
  }
}
