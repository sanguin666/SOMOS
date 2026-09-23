import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoisModule } from '../pois/pois.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { DonationsModule } from '../donations/donations.module.js';
import { Event } from '../events/entities/event.entity.js';
import { MassIntention } from './entities/mass-intention.entity.js';
import { MassIntentionsService } from './mass-intentions.service.js';
import { MassIntentionsController } from './mass-intentions.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([MassIntention, Event]), PoisModule, AuthModule, DonationsModule],
  controllers: [MassIntentionsController],
  providers: [MassIntentionsService],
})
export class MassIntentionsModule {}
