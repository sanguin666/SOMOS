import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JoinPoiDto } from '../user-pois/dto/join-poi.dto.js';
import { AuthService } from './auth.service.js';
import { PhoneAuthService } from './phone-auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RequestPhoneCodeDto } from './dto/request-phone-code.dto.js';
import { VerifyPhoneCodeDto } from './dto/verify-phone-code.dto.js';
import { UpdateLanguageDto } from '../common/dto/update-language.dto.js';
import { JwtAuthGuard, type AuthenticatedRequest } from './guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly phoneAuthService: PhoneAuthService,
  ) {}

  // Email + password, used by the admin dashboard only.
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // The congregant app's login: a code by SMS, no password to remember.
  // Both halves answer the same way whether or not the number has an
  // account, so neither can be used to find out who is registered.
  @Post('phone/request-code')
  requestPhoneCode(@Body() dto: RequestPhoneCodeDto) {
    return this.phoneAuthService.requestCode(dto.phone);
  }

  @Post('phone/verify')
  verifyPhoneCode(@Body() dto: VerifyPhoneCodeDto) {
    return this.phoneAuthService.verifyCode(dto.phone, dto.code, dto.firstName);
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

  // Joining and leaving a place, scoped to whoever the token belongs to.
  // The app never has to know its own user id, and nobody can add or remove
  // a membership for somebody else.
  @Post('me/pois')
  @UseGuards(JwtAuthGuard)
  joinPoi(@Req() request: AuthenticatedRequest, @Body() dto: JoinPoiDto) {
    return this.authService.joinPoi(request.userId, dto);
  }

  @Delete('me/pois/:poiId')
  @UseGuards(JwtAuthGuard)
  leavePoi(@Req() request: AuthenticatedRequest, @Param('poiId') poiId: string) {
    return this.authService.leavePoi(request.userId, poiId);
  }
}
