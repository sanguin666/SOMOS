import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ModulesActifsService } from './modules-actifs.service.js';
import { CreateModuleActifDto } from './dto/create-module-actif.dto.js';
import { UpdateModuleActifDto } from './dto/update-module-actif.dto.js';

@Controller('lieux-de-culte/:lieuDeCulteId/modules-actifs')
export class ModulesActifsController {
  constructor(private readonly modulesActifsService: ModulesActifsService) {}

  @Post()
  activer(
    @Param('lieuDeCulteId') lieuDeCulteId: string,
    @Body() dto: CreateModuleActifDto,
  ) {
    return this.modulesActifsService.activer(lieuDeCulteId, dto);
  }

  @Get()
  findModulesDuLieuDeCulte(@Param('lieuDeCulteId') lieuDeCulteId: string) {
    return this.modulesActifsService.findModulesDuLieuDeCulte(lieuDeCulteId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateModuleActifDto) {
    return this.modulesActifsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesActifsService.remove(id);
  }
}
