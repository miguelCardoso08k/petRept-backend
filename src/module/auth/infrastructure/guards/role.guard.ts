import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from 'src/module/user/domain/enums/role-user.enum';
import { ROLES_KEY } from '../decorators/role.decorator';
import { AuthenticatedRequest } from 'src/core/shared/http/interfaces/authenticated-request.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const currentUserRole = request.user?.role;

    if (!currentUserRole || !requiredRoles.includes(currentUserRole))
      throw new ForbiddenException(
        "You don't have permission to access this resource",
      );

    return true;
  }
}
