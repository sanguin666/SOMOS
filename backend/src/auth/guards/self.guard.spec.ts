import { BadRequestException, ForbiddenException, type ExecutionContext } from '@nestjs/common';
import { SelfGuard } from './self.guard.js';

function contextFor(params: Record<string, string>, userId: string): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => ({ params, userId }) }),
  } as unknown as ExecutionContext;
}

describe('SelfGuard', () => {
  const guard = new SelfGuard();

  it('allows a caller acting on their own account', () => {
    expect(guard.canActivate(contextFor({ id: 'user-1' }, 'user-1'))).toBe(true);
    // `/users/:userId/pois` names the same thing differently.
    expect(guard.canActivate(contextFor({ userId: 'user-1' }, 'user-1'))).toBe(true);
  });

  it("refuses a caller acting on somebody else's account", () => {
    expect(() => guard.canActivate(contextFor({ id: 'user-2' }, 'user-1'))).toThrow(
      ForbiddenException,
    );
  });

  it('refuses a route with no user id to check against', () => {
    expect(() => guard.canActivate(contextFor({}, 'user-1'))).toThrow(BadRequestException);
  });
});
