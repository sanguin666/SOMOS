import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoiBadge } from './entities/poi-badge.entity.js';
import { PoiBadgesService } from './poi-badges.service.js';
import { PoiBadgesController } from './poi-badges.controller.js';
import { PoisModule } from '../pois/pois.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([PoiBadge]), PoisModule, AuthModule],
  controllers: [PoiBadgesController],
  providers: [PoiBadgesService],
})
export class PoiBadgesModule {}
