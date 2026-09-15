import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ActiveModulesService } from './active-modules.service.js';
import { ActivateModuleDto } from './dto/activate-module.dto.js';
import { UpdateActiveModuleDto } from './dto/update-active-module.dto.js';

@Controller('pois/:poiId/active-modules')
export class ActiveModulesController {
  constructor(private readonly activeModulesService: ActiveModulesService) {}

  @Post()
  activate(@Param('poiId') poiId: string, @Body() dto: ActivateModuleDto) {
    return this.activeModulesService.activate(poiId, dto);
  }

  @Get()
  findActiveModulesForPoi(@Param('poiId') poiId: string) {
    return this.activeModulesService.findActiveModulesForPoi(poiId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateActiveModuleDto) {
    return this.activeModulesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activeModulesService.remove(id);
  }
}
