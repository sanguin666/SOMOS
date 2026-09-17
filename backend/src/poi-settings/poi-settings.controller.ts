import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { PoisService } from '../pois/pois.service.js';
import { UpdateLanguageDto } from '../common/dto/update-language.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';

// Deliberately its own tiny module rather than living on PoisController:
// PoisModule can't import AuthModule without a circular dependency
// (AuthModule -> UserPoisModule -> PoisModule already), so any
// admin-gated mutation on a POI's own fields lives out here instead.
@Controller('pois/:poiId')
export class PoiSettingsController {
  constructor(private readonly poisService: PoisService) {}

  @Patch('language')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  updateLanguage(@Param('poiId') poiId: string, @Body() dto: UpdateLanguageDto) {
    return this.poisService.update(poiId, dto);
  }
}
