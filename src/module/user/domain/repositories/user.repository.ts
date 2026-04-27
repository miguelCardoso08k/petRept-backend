import { UserEntity } from '../entities/user.entity';
import { UserRoleEnum } from '../enums/role-user.enum';

export abstract class UserRepository {
  abstract create(user: UserEntity): Promise<UserEntity>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByName(name: string): Promise<UserEntity[]>;
  abstract updateEmail(id: string, email: string): Promise<UserEntity>;
  abstract updateName(id: string, name: string): Promise<UserEntity>;
  abstract updateRole(id: string, role: UserRoleEnum): Promise<UserEntity>;
  abstract updatePassword(
    id: string,
    passwordHash: string,
  ): Promise<UserEntity>;
  abstract updateIsActive(id: string, isActive: boolean): Promise<UserEntity>;
  abstract delete(id: string): Promise<void>;
}
