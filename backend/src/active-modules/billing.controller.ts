import { Body, Controller, Delete, Get, Param, ParseEnumPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ModuleBillingService } from './module-billing.service.js';
import { SetBillingIntervalDto, SetPaymentMethodDto } from './dto/billing.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';
import { ModuleType } from '../common/enums/module-type.enum.js';

// The admin's Modules page: what the community has, what it pays, and
// switching modules on and off under the pricing rules.
@Controller('pois/:poiId/billing')
@UseGuards(JwtAuthGuard, PoiAdminGuard)
export class BillingController {
  constructor(private readonly billing: ModuleBillingService) {}

  @Get()
  summary(@Param('poiId') poiId: string) {
    return this.billing.summary(poiId);
  }

  @Post('modules/:type/start')
  start(@Param('poiId') poiId: string, @Param('type', new ParseEnumPipe(ModuleType)) type: ModuleType) {
    return this.billing.start(poiId, type);
  }

  @Post('modules/:type/subscribe')
  subscribe(@Param('poiId') poiId: string, @Param('type', new ParseEnumPipe(ModuleType)) type: ModuleType) {
    return this.billing.subscribe(poiId, type);
  }

  @Post('modules/:type/stop')
  stop(@Param('poiId') poiId: string, @Param('type', new ParseEnumPipe(ModuleType)) type: ModuleType) {
    return this.billing.stop(poiId, type);
  }

  @Post('modules/:type/resume')
  resume(@Param('poiId') poiId: string, @Param('type', new ParseEnumPipe(ModuleType)) type: ModuleType) {
    return this.billing.resume(poiId, type);
  }

  @Put('interval')
  setInterval(@Param('poiId') poiId: string, @Body() dto: SetBillingIntervalDto) {
    return this.billing.setInterval(poiId, dto.interval);
  }

  @Put('payment-method')
  setPaymentMethod(@Param('poiId') poiId: string, @Body() dto: SetPaymentMethodDto) {
    const label = dto.kind === 'sepa' ? `SEPA •••• ${dto.last4}` : `Carte •••• ${dto.last4}`;
    return this.billing.setPaymentMethod(poiId, label);
  }

  @Delete('payment-method')
  removePaymentMethod(@Param('poiId') poiId: string) {
    return this.billing.setPaymentMethod(poiId, null);
  }
}
