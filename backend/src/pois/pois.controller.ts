import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PoisService } from './pois.service.js';
import { CreatePoiDto } from './dto/create-poi.dto.js';
import { UpdatePoiDto } from './dto/update-poi.dto.js';

@Controller('pois')
export class PoisController {
  constructor(private readonly poisService: PoisService) {}

  @Post()
  create(@Body() createPoiDto: CreatePoiDto) {
    return this.poisService.create(createPoiDto);
  }

  @Get()
  findAll() {
    return this.poisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.poisService.findOne(id);
  }

  // Used by the app when scanning the QR code displayed on the POI's flyer.
  @Get('qr/:qrCodeToken')
  findByQrCodeToken(@Param('qrCodeToken') qrCodeToken: string) {
    return this.poisService.findByQrCodeToken(qrCodeToken);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoiDto: UpdatePoiDto) {
    return this.poisService.update(id, updatePoiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.poisService.remove(id);
  }
}
