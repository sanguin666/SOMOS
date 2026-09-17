import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { UpdateLanguageDto } from '../common/dto/update-language.dto.js';
import { JwtAuthGuard, type AuthenticatedRequest } from './guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: AuthenticatedRequest) {
    return this.authService.me(request.userId);
  }

  @Patch('me/language')
  @UseGuards(JwtAuthGuard)
  updateMyLanguage(@Req() request: AuthenticatedRequest, @Body() dto: UpdateLanguageDto) {
    return this.authService.updateMyLanguage(request.userId, dto.language);
  }
}
