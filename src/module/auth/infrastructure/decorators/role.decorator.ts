import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../../../user/domain/enums/role-user.enum';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
