import { User } from '../../../../core/database/prisma/generated/client';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRoleEnum } from '../../domain/enums/role-user.enum';

export class UserMapper {
  static toEntity(raw: User) {
    return new UserEntity({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      passwordHash: raw.password_hash,
      role: raw.role as UserRoleEnum,
      isActive: raw.is_active,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
  }

  static toPersistence(entity: UserEntity) {
    return {
      name: entity.name,
      email: entity.email,
      password_hash: entity.passwordHash,
      role: entity.role,
      is_active: entity.isActive,
    };
  }

  static toHttp(entity: UserEntity) {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      role: entity.role,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
