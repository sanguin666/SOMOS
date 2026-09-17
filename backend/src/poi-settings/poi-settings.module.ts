import { Module } from '@nestjs/common';
import { PoiSettingsController } from './poi-settings.controller.js';
import { PoisModule } from '../pois/pois.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [PoisModule, AuthModule],
  controllers: [PoiSettingsController],
})
export class PoiSettingsModule {}
