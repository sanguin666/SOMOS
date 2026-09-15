import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiveModule } from './entities/active-module.entity.js';
import { ActiveModulesService } from './active-modules.service.js';
import { ActiveModulesController } from './active-modules.controller.js';
import { PoisModule } from '../pois/pois.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([ActiveModule]), PoisModule],
  controllers: [ActiveModulesController],
  providers: [ActiveModulesService],
  exports: [ActiveModulesService],
})
export class ActiveModulesModule {}
