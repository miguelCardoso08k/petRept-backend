import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserEntity } from '../domain/entities/user.entity';
import { PrismaService } from '../../../core/config/prisma/prisma.service';
import { UserMapper } from './mappers/user.mapper';
import { UserRoleEnum } from '../domain/enums/role-user.enum';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const created = await this.prisma.user.create({
      data: UserMapper.toPersistence(user),
    });

    return UserMapper.toEntity(created);
  }

  async findAll(): Promise<UserEntity[]> {
    const found = await this.prisma.user.findMany();

    return found.map((user) => UserMapper.toEntity(user));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const found = await this.prisma.user.findUnique({ where: { id } });

    return found ? UserMapper.toEntity(found) : null;
  }

  async findByName(name: string): Promise<UserEntity[]> {
    const found = await this.prisma.user.findMany({
      where: { name: { contains: name } },
    });

    return found.map((user) => UserMapper.toEntity(user));
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const found = await this.prisma.user.findUnique({ where: { email } });

    return found ? UserMapper.toEntity(found) : null;
  }

  async updateEmail(id: string, email: string): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: { email },
    });

    return UserMapper.toEntity(updated);
  }

  async updateName(id: string, name: string): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: { name },
    });

    return UserMapper.toEntity(updated);
  }

  async updatePassword(id: string, passwordHash: string): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: { password_hash: passwordHash },
    });

    return UserMapper.toEntity(updated);
  }

  async updateRole(id: string, role: UserRoleEnum): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: { role },
    });

    return UserMapper.toEntity(updated);
  }

  async updateIsActive(id: string, isActive: boolean): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: { is_active: isActive },
    });

    return UserMapper.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
