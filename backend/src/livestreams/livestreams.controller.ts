import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { LivestreamsService } from './livestreams.service.js';
import { CreateLivestreamDto } from './dto/create-livestream.dto.js';
import { UpdateLivestreamDto } from './dto/update-livestream.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';

@Controller('pois/:poiId/livestreams')
export class LivestreamsController {
  constructor(private readonly livestreamsService: LivestreamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  create(@Param('poiId') poiId: string, @Body() dto: CreateLivestreamDto) {
    return this.livestreamsService.create(poiId, dto);
  }

  @Get()
  findForPoi(@Param('poiId') poiId: string) {
    return this.livestreamsService.findForPoi(poiId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  update(
    @Param('poiId') poiId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLivestreamDto,
  ) {
    return this.livestreamsService.update(poiId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  remove(@Param('poiId') poiId: string, @Param('id') id: string) {
    return this.livestreamsService.remove(poiId, id);
  }
}
