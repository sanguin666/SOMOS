import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoiPageBlock } from './entities/poi-page-block.entity.js';
import { PoiPageService } from './poi-page.service.js';
import { PoiPageController } from './poi-page.controller.js';
import { PoisModule } from '../pois/pois.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([PoiPageBlock]), PoisModule, AuthModule],
  controllers: [PoiPageController],
  providers: [PoiPageService],
  exports: [PoiPageService],
})
export class PoiPageModule {}
