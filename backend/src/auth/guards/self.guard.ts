import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { AuthenticatedRequest } from './jwt-auth.guard.js';

/**
 * Must run after JwtAuthGuard. Allows the request only when the user id in
 * the URL is the caller's own — the rule for anything under `/users/:id`,
 * where the id in the path is the only thing saying whose data it is.
 *
 * Deliberately has no "unless you're an admin" escape hatch: a parish admin
 * manages their parish, not the people in it.
 */
@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const target = request.params.id ?? request.params.userId;
    if (typeof target !== 'string') {
      throw new BadRequestException('Missing user id route param');
    }
    if (target !== request.userId) {
      throw new ForbiddenException('You can only do this to your own account');
    }
    return true;
  }
}
