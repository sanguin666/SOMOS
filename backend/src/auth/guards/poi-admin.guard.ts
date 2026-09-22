import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPoi } from '../../user-pois/entities/user-poi.entity.js';
import { MemberRole } from '../../common/enums/member-role.enum.js';
import type { AuthenticatedRequest } from './jwt-auth.guard.js';

// Must run after JwtAuthGuard (which sets request.userId). Requires the
// authenticated user to be an ADMIN member of the POI named by the route's
// `:poiId` param — the same param every POI-scoped controller already uses.
//
// Queries the `user_pois` table directly rather than going through
// UserPoisService: that service depends on PoisService and UsersService, so
// injecting it here would make every module that guards a route import the
// modules it is guarding. See auth-guards.module.ts.
@Injectable()
export class PoiAdminGuard implements CanActivate {
  constructor(
    @InjectRepository(UserPoi)
    private readonly membershipRepository: Repository<UserPoi>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const poiId = request.params.poiId;
    if (typeof poiId !== 'string') {
      throw new BadRequestException('Missing poiId route param');
    }
    const membership = await this.membershipRepository.findOne({
      where: {
        user: { id: request.userId },
        poi: { id: poiId },
        role: MemberRole.ADMIN,
      },
    });
    if (!membership) {
      throw new ForbiddenException('You are not an admin of this POI');
    }
    return true;
  }
}
