import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poi } from './entities/poi.entity.js';
import { PoisService } from './pois.service.js';
import { PoisController } from './pois.controller.js';
import { UserPoi } from '../user-pois/entities/user-poi.entity.js';
import { AuthGuardsModule } from '../auth/auth-guards.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Poi, UserPoi]), AuthGuardsModule],
  controllers: [PoisController],
  providers: [PoisService],
  exports: [PoisService],
})
export class PoisModule {}
