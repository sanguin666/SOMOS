import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserPoisService } from '../../user-pois/user-pois.service.js';
import type { AuthenticatedRequest } from './jwt-auth.guard.js';

// Must run after JwtAuthGuard (which sets request.userId). Requires the
// authenticated user to be an ADMIN member of the POI named by the route's
// `:poiId` param — the same param every POI-scoped controller already uses.
@Injectable()
export class PoiAdminGuard implements CanActivate {
  constructor(private readonly userPoisService: UserPoisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const poiId = request.params.poiId;
    if (typeof poiId !== 'string') {
      throw new BadRequestException('Missing poiId route param');
    }
    const isAdmin = await this.userPoisService.isAdminOfPoi(request.userId, poiId);
    if (!isAdmin) {
      throw new ForbiddenException('You are not an admin of this POI');
    }
    return true;
  }
}
