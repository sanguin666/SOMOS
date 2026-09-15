import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleActif } from './entities/module-actif.entity.js';
import { ModulesActifsService } from './modules-actifs.service.js';
import { ModulesActifsController } from './modules-actifs.controller.js';
import { LieuxDeCulteModule } from '../lieux-de-culte/lieux-de-culte.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleActif]), LieuxDeCulteModule],
  controllers: [ModulesActifsController],
  providers: [ModulesActifsService],
  exports: [ModulesActifsService],
})
export class ModulesActifsModule {}
