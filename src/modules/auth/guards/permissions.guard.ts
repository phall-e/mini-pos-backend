import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserResponseDto } from '@modules/admin/system/user/dto/user-response.dto';

type AuthenticatedRequest = {
  user?: UserResponseDto;
};

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!permissions || permissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    if (!user) throw new ForbiddenException();

    if (user.isAdmin) {
      return true;
    }
    const roles = Array.isArray(user.roles) ? user.roles : [];
    const permission = roles
      .flatMap((role) => role.permissions ?? [])
      .map((item) => item.name)
      .filter(Boolean);

    if (permission.length === 0) {
      throw new ForbiddenException('Invalid permissions');
    }

    const hasPermission = this.matchPermissions(permission, permissions);
    if (!hasPermission) {
      throw new ForbiddenException();
    }

    return true;
  }

  matchPermissions(
    userPermissions: string[],
    requiredPermissioins: string[],
  ): boolean {
    return requiredPermissioins.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
