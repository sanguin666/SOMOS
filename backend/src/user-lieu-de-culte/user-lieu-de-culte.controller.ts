import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserLieuDeCulteService } from './user-lieu-de-culte.service.js';
import { RattacherLieuDeCulteDto } from './dto/rattacher-lieu-de-culte.dto.js';

@Controller('users/:userId/lieux-de-culte')
export class UserLieuDeCulteController {
  constructor(
    private readonly userLieuDeCulteService: UserLieuDeCulteService,
  ) {}

  // Appelé après le scan du QR code du flyer pour rattacher l'utilisateur au lieu de culte.
  @Post()
  rattacher(
    @Param('userId') userId: string,
    @Body() dto: RattacherLieuDeCulteDto,
  ) {
    return this.userLieuDeCulteService.rattacher(userId, dto);
  }

  @Get()
  findLieuxDeCulteDuUser(@Param('userId') userId: string) {
    return this.userLieuDeCulteService.findLieuxDeCulteDuUser(userId);
  }

  @Delete(':lieuDeCulteId')
  detacher(
    @Param('userId') userId: string,
    @Param('lieuDeCulteId') lieuDeCulteId: string,
  ) {
    return this.userLieuDeCulteService.detacher(userId, lieuDeCulteId);
  }
}
