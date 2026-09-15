import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserPoisService } from './user-pois.service.js';
import { JoinPoiDto } from './dto/join-poi.dto.js';

@Controller('users/:userId/pois')
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
