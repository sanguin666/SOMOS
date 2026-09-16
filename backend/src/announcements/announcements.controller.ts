import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';

@Controller('pois/:poiId/announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  create(@Param('poiId') poiId: string, @Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(poiId, dto);
  }

  @Get()
  findForPoi(@Param('poiId') poiId: string) {
    return this.announcementsService.findForPoi(poiId);
  }
}
