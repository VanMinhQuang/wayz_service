import { CanActivate, ExecutionContext, Injectable, SetMetadata, createParamDecorator } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

export type JwtUser = { sub: string; phone: string; roles: string[] };
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUser => ctx.switchToHttp().getRequest().user,
);
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const required =
      this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]) ?? [];
    if (!required.length) return true;
    const user = context.switchToHttp().getRequest().user as JwtUser | undefined;
    return !!user && required.some((role) => user.roles.includes(role));
  }
}
