import { UserEntity } from '../../domain/entities/user.entity';
import { UserRoleEnum } from '../../domain/enums/role-user.enum';

type RawUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRoleEnum;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export class UserMapper {
  static toEntity(raw: RawUser) {
    return new UserEntity({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      passwordHash: raw.password_hash,
      role: raw.role,
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
