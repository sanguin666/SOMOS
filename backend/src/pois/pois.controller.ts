import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PoisService } from './pois.service.js';
import { CreatePoiDto } from './dto/create-poi.dto.js';
import { UpdatePoiDto } from './dto/update-poi.dto.js';
import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';

@Controller('pois')
export class PoisController {
  constructor(private readonly poisService: PoisService) {}

  /**
   * Creating a place needs an account, and whoever creates it becomes its
   * first admin — otherwise a brand-new parish would have nobody able to
   * manage it, and anyone at all could fill the directory with places.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() request: AuthenticatedRequest, @Body() createPoiDto: CreatePoiDto) {
    return this.poisService.createOwnedBy(request.userId, createPoiDto);
  }

  // Reading stays open: which places exist, and what one of them is called,
  // is the public directory the app and the landing page both browse.
  @Get()
  findAll() {
    return this.poisService.findAll();
  }

  @Get(':poiId')
  findOne(@Param('poiId') poiId: string) {
    return this.poisService.findOne(poiId);
  }

  // Used by the app when scanning the QR code displayed on the POI's flyer.
  @Get('qr/:qrCodeToken')
  findByQrCodeToken(@Param('qrCodeToken') qrCodeToken: string) {
    return this.poisService.findByQrCodeToken(qrCodeToken);
  }

  // The param is named `:poiId` rather than `:id` so PoiAdminGuard, which
  // every other POI-scoped controller already uses, can find it.
  @Patch(':poiId')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  update(@Param('poiId') poiId: string, @Body() updatePoiDto: UpdatePoiDto) {
    return this.poisService.update(poiId, updatePoiDto);
  }

  @Delete(':poiId')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  remove(@Param('poiId') poiId: string) {
    return this.poisService.remove(poiId);
  }
}
