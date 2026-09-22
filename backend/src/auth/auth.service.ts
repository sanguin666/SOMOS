import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import { UserPoisService } from '../user-pois/user-pois.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JoinPoiDto } from '../user-pois/dto/join-poi.dto.js';
import type { Language } from '../common/enums/language.enum.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userPoisService: UserPoisService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmailForLogin(dto.email);
    if (!user?.passwordHash || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const accessToken = await this.jwtService.signAsync({ sub: user.id });
    return { accessToken };
  }

  async me(userId: string) {
    const user = await this.usersService.findOne(userId);
    const [adminPois, memberships] = await Promise.all([
      this.userPoisService.findAdminPoisForUser(userId),
      this.userPoisService.findPoisForUser(userId),
    ]);
    return {
      id: user.id,
      email: user.email,
      // Congregants have a phone and no email; admins the other way round.
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      language: user.language,
      adminPois,
      // Every place this person belongs to, admin or not — the app's "my
      // places" list, which used to be device-local only.
      pois: memberships.map((membership) => membership.poi),
    };
  }

  /**
   * Re-joining a place you already belong to is not an error worth showing
   * anyone: the app calls this every time a signed-in person opens a place,
   * so the expected outcome is "you're a member", not "you just joined".
   */
  async joinPoi(userId: string, dto: JoinPoiDto) {
    try {
      return await this.userPoisService.join(userId, dto);
    } catch (error) {
      if (error instanceof ConflictException) {
        return this.userPoisService.findMembership(userId, dto.qrCodeToken);
      }
      throw error;
    }
  }

  leavePoi(userId: string, poiId: string): Promise<void> {
    return this.userPoisService.leave(userId, poiId);
  }

  async updateMyLanguage(userId: string, language: Language): Promise<{ language: Language }> {
    const user = await this.usersService.updateLanguage(userId, language);
    return { language: user.language };
  }
}
