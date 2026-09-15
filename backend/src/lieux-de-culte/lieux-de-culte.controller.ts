import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LieuxDeCulteService } from './lieux-de-culte.service.js';
import { CreateLieuDeCulteDto } from './dto/create-lieu-de-culte.dto.js';
import { UpdateLieuDeCulteDto } from './dto/update-lieu-de-culte.dto.js';

@Controller('lieux-de-culte')
export class LieuxDeCulteController {
  constructor(private readonly lieuxDeCulteService: LieuxDeCulteService) {}

  @Post()
  create(@Body() createLieuDeCulteDto: CreateLieuDeCulteDto) {
    return this.lieuxDeCulteService.create(createLieuDeCulteDto);
  }

  @Get()
  findAll() {
    return this.lieuxDeCulteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lieuxDeCulteService.findOne(id);
  }

  // Utilisé par l'app lors du scan du QR code affiché sur le flyer du lieu de culte.
  @Get('qr/:qrCodeToken')
  findByQrCodeToken(@Param('qrCodeToken') qrCodeToken: string) {
    return this.lieuxDeCulteService.findByQrCodeToken(qrCodeToken);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLieuDeCulteDto: UpdateLieuDeCulteDto,
  ) {
    return this.lieuxDeCulteService.update(id, updateLieuDeCulteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lieuxDeCulteService.remove(id);
  }
}
