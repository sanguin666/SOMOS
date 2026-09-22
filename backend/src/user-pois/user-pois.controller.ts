import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserPoisService } from './user-pois.service.js';
import { JoinPoiDto } from './dto/join-poi.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SelfGuard } from '../auth/guards/self.guard.js';

/**
 * Who belongs to which place, addressed by user id. The app uses the
 * equivalent `/auth/me/pois` routes instead, which need no id at all; these
 * stay for anything that already knows a user id, and are restricted to
 * that user — a membership is not something a stranger gets to add or
 * remove.
 */
@Controller('users/:userId/pois')
@UseGuards(JwtAuthGuard, SelfGuard)
export class UserPoisController {
  constructor(private readonly userPoisService: UserPoisService) {}

  // Called after scanning the flyer's QR code to join the user to the POI.
  @Post()
  join(@Param('userId') userId: string, @Body() dto: JoinPoiDto) {
    return this.userPoisService.join(userId, dto);
  }

  @Get()
  findPoisForUser(@Param('userId') userId: string) {
    return this.userPoisService.findPoisForUser(userId);
  }

  @Delete(':poiId')
  leave(@Param('userId') userId: string, @Param('poiId') poiId: string) {
    return this.userPoisService.leave(userId, poiId);
  }
}
