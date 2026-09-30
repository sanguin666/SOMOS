import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyReading } from './entities/daily-reading.entity.js';
import { DailyReadingsService } from './daily-readings.service.js';
import { DailyReadingsController } from './daily-readings.controller.js';
import { ActiveModule } from '../active-modules/entities/active-module.entity.js';
import { PoisModule } from '../pois/pois.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([DailyReading, ActiveModule]), PoisModule, AuthModule, NotificationsModule],
  controllers: [DailyReadingsController],
  providers: [DailyReadingsService],
  exports: [DailyReadingsService],
})
export class DailyReadingsModule {}
