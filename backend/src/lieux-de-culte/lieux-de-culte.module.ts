import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LieuDeCulte } from './entities/lieu-de-culte.entity.js';
import { LieuxDeCulteService } from './lieux-de-culte.service.js';
import { LieuxDeCulteController } from './lieux-de-culte.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([LieuDeCulte])],
  controllers: [LieuxDeCulteController],
  providers: [LieuxDeCulteService],
  exports: [LieuxDeCulteService],
})
export class LieuxDeCulteModule {}
