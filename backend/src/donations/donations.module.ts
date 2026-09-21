import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from './entities/donation.entity.js';
import { DonationsService } from './donations.service.js';
import { DonationsController, DonationReturnController } from './donations.controller.js';
import { StripeWebhookController } from './stripe-webhook.controller.js';
import { StripeService } from './stripe.service.js';
import { PoisModule } from '../pois/pois.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Donation]), PoisModule, AuthModule],
  controllers: [DonationsController, DonationReturnController, StripeWebhookController],
  providers: [DonationsService, StripeService],
  exports: [DonationsService],
})
export class DonationsModule {}
