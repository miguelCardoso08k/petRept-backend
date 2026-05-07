import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PasswordHasherRepository } from '../domain/repositories/password-hasher.repository';
import { UserRepository } from '../../user/domain/repositories/user.repository';
import { TokenRepository } from '../domain/repositories/token.repository';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedUserEntity } from '../domain/entities/authenticated-user.entity';
import { RegisterPasswordDto } from './dto/register-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PasswordHasherRepository)
    private readonly passwordHasher: PasswordHasherRepository,
    @Inject(UserRepository) private readonly userRepository: UserRepository,
    @Inject(TokenRepository) private readonly tokenRepository: TokenRepository,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive || !user.passwordHash)
      throw new ForbiddenException('User is not active');

    const isPasswordValid = await this.passwordHasher.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const authenticatedUser = new AuthenticatedUserEntity({
      id: user.id!,
      email: user.email,
      role: user.role,
    });

    const token = await this.tokenRepository.signAccessToken(authenticatedUser);

    return {
      token,
      user: authenticatedUser,
    };
  }

  logout(userId: string, token: string): void {
    return;
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    if (dto.currentPassword === dto.newPassword)
      throw new UnprocessableEntityException(
        'New password cannot be the same as the current one',
      );

    if (dto.newPassword !== dto.confirmNewPassword)
      throw new UnprocessableEntityException('New passwords do not match');

    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    if (!user.isActive || !user.passwordHash)
      throw new ForbiddenException('User is not active');

    const isCurrentPasswordValid = await this.passwordHasher.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid)
      throw new UnauthorizedException('Current password is incorrect');

    const newPasswordHasher = await this.passwordHasher.hash(dto.newPassword);

    try {
      await this.userRepository.updatePassword(userId, newPasswordHasher);
    } catch {
      throw new InternalServerErrorException('Change password failed');
    }
  }

  forgotPassword(dto: ForgotPasswordDto): void {
    return;
  }

  async registerPassword(dto: RegisterPasswordDto): Promise<void> {
    if (dto.password !== dto.confirmPassword)
      throw new UnprocessableEntityException('Passwords do not match');

    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) throw new NotFoundException('User not found');

    if (!user.id)
      throw new InternalServerErrorException('Incorrectly registered user');

    await this.userRepository.updateIsActive(user.id, true);

    if (user.passwordHash)
      throw new ConflictException('User already has a password set');

    const passwordHash = await this.passwordHasher.hash(dto.password);

    try {
      await this.userRepository.updatePassword(user.id, passwordHash);
    } catch {
      await this.roolbackUserActivation(user.id);
      throw new InternalServerErrorException('Failed to set password');
    }
  }

  private async roolbackUserActivation(userId: string): Promise<void> {
    try {
      await this.userRepository.updateIsActive(userId, false);
    } catch {
      throw new InternalServerErrorException(
        'failed registering password and rolling back activation',
      );
    }
  }
}
