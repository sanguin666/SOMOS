import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPoi } from '../user-pois/entities/user-poi.entity.js';
import { JwtAuthGuard, OptionalJwtAuthGuard } from './guards/jwt-auth.guard.js';
import { requireJwtSecret } from './jwt-secret.js';
import { SignedUrlService } from '../common/signed-url/signed-url.service.js';
import { PoiAdminGuard } from './guards/poi-admin.guard.js';
import { SelfGuard } from './guards/self.guard.js';

/**
 * The guards, and the JWT setup they need, with no dependency on the
 * modules they protect.
 *
 * That independence is the point: `users`, `user-pois` and `pois` all need
 * guards, and AuthModule needs all three of them, so having the guards live
 * in AuthModule made those imports circular. This module depends on nothing
 * but the `user_pois` table, so anything can import it.
 */
export const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: requireJwtSecret(configService),
    signOptions: { expiresIn: '7d' },
  }),
});


// Exported as well as imported: a guard named in `@UseGuards(...)` is
// instantiated in the injector of the module whose controller uses it, so
// that module — not this one — has to be able to resolve UserPoiRepository.
const userPoiFeature = TypeOrmModule.forFeature([UserPoi]);

@Module({
  imports: [jwtModule, userPoiFeature],
  providers: [JwtAuthGuard, OptionalJwtAuthGuard, PoiAdminGuard, SelfGuard, SignedUrlService],
  exports: [
    JwtAuthGuard,
    OptionalJwtAuthGuard,
    PoiAdminGuard,
    SelfGuard,
    SignedUrlService,
    jwtModule,
    userPoiFeature,
  ],
})
export class AuthGuardsModule {}
