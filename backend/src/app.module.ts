import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { buildTypeOrmConfig } from './config/typeorm.config.js';
import { UsersModule } from './users/users.module.js';
import { PoisModule } from './pois/pois.module.js';
import { UserPoisModule } from './user-pois/user-pois.module.js';
import { ActiveModulesModule } from './active-modules/active-modules.module.js';
import { AnnouncementsModule } from './announcements/announcements.module.js';
import { PrayerRequestsModule } from './prayer-requests/prayer-requests.module.js';
import { LivestreamsModule } from './livestreams/livestreams.module.js';
import { CommunityModule } from './community/community.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DonationsModule } from './donations/donations.module.js';
import { PoiSettingsModule } from './poi-settings/poi-settings.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: buildTypeOrmConfig,
    }),
    UsersModule,
    PoisModule,
    UserPoisModule,
    ActiveModulesModule,
    AnnouncementsModule,
    PrayerRequestsModule,
    LivestreamsModule,
    CommunityModule,
    AuthModule,
    DonationsModule,
    PoiSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
