import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PoiBadgesService } from './poi-badges.service.js';
import { CreateBadgeDto } from './dto/create-badge.dto.js';
import { UpdateBadgeDto } from './dto/update-badge.dto.js';
import { ReorderBadgesDto } from './dto/reorder-badges.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';

@Controller('pois/:poiId/badges')
export class PoiBadgesController {
  constructor(private readonly badgesService: PoiBadgesService) {}

  // Open, like the page blocks: the top of the place's home page.
  @Get()
  findShown(@Param('poiId') poiId: string) {
    return this.badgesService.findShown(poiId);
  }

  // Everything, switched off and expired included, for the dashboard.
  @Get('all')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  findAll(@Param('poiId') poiId: string) {
    return this.badgesService.findAll(poiId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  create(@Param('poiId') poiId: string, @Body() dto: CreateBadgeDto) {
    return this.badgesService.create(poiId, dto);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  reorder(@Param('poiId') poiId: string, @Body() dto: ReorderBadgesDto) {
    return this.badgesService.reorder(poiId, dto.ids);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  update(@Param('poiId') poiId: string, @Param('id') id: string, @Body() dto: UpdateBadgeDto) {
    return this.badgesService.update(poiId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  remove(@Param('poiId') poiId: string, @Param('id') id: string) {
    return this.badgesService.remove(poiId, id);
  }
}
