import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserEntity } from '../domain/entities/user.entity';
import { UserRoleEnum } from '../domain/enums/role-user.enum';
import { UpdateRoleUserDto } from './dto/update-role-user.dto';
import { UpdateNameUserDto } from './dto/update-name-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = new UserEntity({
      name: dto.name,
      email: dto.email,
      role: dto.role || UserRoleEnum.EMPLOYEE,
      isActive: false,
    });

    return await this.userRepository.create(user);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findByName(name: string) {
    return await this.userRepository.findByName(name);
  }

  async updateRole(id: string, dto: UpdateRoleUserDto) {
    await this.findById(id);

    return await this.userRepository.updateRole(id, dto.role);
  }

  async updateName(id: string, dto: UpdateNameUserDto) {
    await this.findById(id);

    return await this.userRepository.updateName(id, dto.name);
  }

  async activete(id: string) {
    const user = await this.findById(id);

    if (user.isActive) return user;

    return await this.userRepository.updateIsActive(id, true);
  }

  async deactivate(id: string) {
    const user = await this.findById(id);

    if (!user.isActive) return user;

    return await this.userRepository.updateIsActive(id, false);
  }

  async remove(id: string) {
    await this.findById(id);

    try {
      await this.userRepository.delete(id);
    } catch {
      throw new InternalServerErrorException('Deleting user failed');
    }
  }
}
