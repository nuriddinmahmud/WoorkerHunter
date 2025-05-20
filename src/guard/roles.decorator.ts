import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  VIEWER_ADMIN = 'VIEWER_ADMIN',
  USER_FIZ = 'USER_FIZ',
  USER_YUR = 'USER_YUR',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
