import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { PoiAdminGuard } from './guards/poi-admin.guard.js';
import { UsersModule } from '../users/users.module.js';
import { UserPoisModule } from '../user-pois/user-pois.module.js';

const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    // Fine for the local demo — set a real JWT_SECRET before any
    // production use.
    secret: configService.get<string>('JWT_SECRET', 'dev-only-insecure-secret'),
    signOptions: { expiresIn: '7d' },
  }),
});

@Module({
  imports: [UsersModule, UserPoisModule, jwtModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, PoiAdminGuard],
  // Re-export JwtModule and UserPoisModule too: the guards depend on
  // JwtService and UserPoisService, and Nest needs those visible wherever
  // the guards are used, not just here.
  exports: [JwtAuthGuard, PoiAdminGuard, jwtModule, UserPoisModule],
})
export class AuthModule {}
