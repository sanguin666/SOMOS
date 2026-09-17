import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Livestream } from './entities/livestream.entity.js';
import { LivestreamsService } from './livestreams.service.js';
import { LivestreamsController } from './livestreams.controller.js';
import { PoisModule } from '../pois/pois.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Livestream]), PoisModule, AuthModule],
  controllers: [LivestreamsController],
  providers: [LivestreamsService],
  exports: [LivestreamsService],
})
export class LivestreamsModule {}
