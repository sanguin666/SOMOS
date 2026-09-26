import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushToken } from './entities/push-token.entity.js';
import { UserPoi } from '../user-pois/entities/user-poi.entity.js';
import { AuthGuardsModule } from '../auth/auth-guards.module.js';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { ExpoPushClient } from './expo-push.client.js';

@Module({
  imports: [TypeOrmModule.forFeature([PushToken, UserPoi]), AuthGuardsModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, ExpoPushClient],
  exports: [NotificationsService],
})
export class NotificationsModule {}
