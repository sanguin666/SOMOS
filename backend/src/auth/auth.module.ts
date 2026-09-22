import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PhoneAuthService } from './phone-auth.service.js';
import { PhoneVerificationCode } from './entities/phone-verification-code.entity.js';
import { ConsoleSmsSender, SmsSender } from './sms/sms-sender.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { PoiAdminGuard } from './guards/poi-admin.guard.js';
import { UsersModule } from '../users/users.module.js';
import { UserPoisModule } from '../user-pois/user-pois.module.js';

const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: requireJwtSecret(configService),
    signOptions: { expiresIn: '7d' },
  }),
});

// Development keeps a fixed fallback so the demo starts with no .env at
// all, but production refuses to boot without a real secret: a predictable
// signing key means anyone can mint a token for any account, including a
// parish admin's.
function requireJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');
  if (secret) {
    return secret;
  }
  if (configService.get<string>('NODE_ENV', 'development') === 'production') {
    throw new Error(
      'JWT_SECRET must be set in production — see backend/.env.example.',
    );
  }
  return 'dev-only-insecure-secret';
}

@Module({
  imports: [
    UsersModule,
    UserPoisModule,
    jwtModule,
    TypeOrmModule.forFeature([PhoneVerificationCode]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PhoneAuthService,
    JwtAuthGuard,
    PoiAdminGuard,
    // Swap this provider for a Twilio-backed SmsSender to send real codes;
    // nothing else in the login flow needs to change.
    { provide: SmsSender, useClass: ConsoleSmsSender },
  ],
  // Re-export JwtModule and UserPoisModule too: the guards depend on
  // JwtService and UserPoisService, and Nest needs those visible wherever
  // the guards are used, not just here.
  exports: [JwtAuthGuard, PoiAdminGuard, jwtModule, UserPoisModule],
})
export class AuthModule {}
