import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, type AuthenticatedRequest } from '../auth/guards/jwt-auth.guard.js';
import { NotificationsService } from './notifications.service.js';
import { RegisterPushTokenDto } from './dto/register-push-token.dto.js';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto.js';

/**
 * The signed-in person's own phones and notification choices, next to the
 * other `/auth/me` routes so the app never needs to know its user id.
 */
@Controller('auth/me')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Called on every launch once notifications are allowed.
  @Post('push-tokens')
  @HttpCode(204)
  register(@Req() request: AuthenticatedRequest, @Body() dto: RegisterPushTokenDto) {
    return this.notificationsService.registerToken(request.userId, dto);
  }

  // Called on sign out, so the phone stops receiving the person's news.
  @Delete('push-tokens/:token')
  @HttpCode(204)
  remove(@Req() request: AuthenticatedRequest, @Param('token') token: string) {
    return this.notificationsService.removeToken(request.userId, token);
  }

  @Get('pois/:poiId/notifications')
  preferences(@Req() request: AuthenticatedRequest, @Param('poiId', ParseUUIDPipe) poiId: string) {
    return this.notificationsService.getPreferences(request.userId, poiId);
  }

  @Patch('pois/:poiId/notifications')
  updatePreferences(
    @Req() request: AuthenticatedRequest,
    @Param('poiId', ParseUUIDPipe) poiId: string,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    return this.notificationsService.updatePreferences(request.userId, poiId, dto);
  }

  // The events in this place whose bell is on.
  @Get('pois/:poiId/event-reminders')
  eventReminders(@Req() request: AuthenticatedRequest, @Param('poiId', ParseUUIDPipe) poiId: string) {
    return this.notificationsService.listEventReminders(request.userId, poiId);
  }

  @Put('event-reminders/:eventId')
  @HttpCode(204)
  addEventReminder(@Req() request: AuthenticatedRequest, @Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.notificationsService.addEventReminder(request.userId, eventId);
  }

  @Delete('event-reminders/:eventId')
  @HttpCode(204)
  removeEventReminder(@Req() request: AuthenticatedRequest, @Param('eventId', ParseUUIDPipe) eventId: string) {
    return this.notificationsService.removeEventReminder(request.userId, eventId);
  }
}
