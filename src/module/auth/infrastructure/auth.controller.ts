import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../application/dto/login.dto';
import { AuthMapper } from './mappers/auth.mapper';
import { CurrentUser } from '../../../core/shared/http/decorators/current-user.decorator';
import { AuthenticatedUserEntity } from '../domain/entities/authenticated-user.entity';
import type { AuthenticatedRequest } from '../../../core/shared/http/interfaces/authenticated-request.interface';
import { ChangePasswordDto } from '../application/dto/change-password.dto';
import { Public } from './decorators/public.decorator';
import { RegisterPasswordDto } from '../application/dto/register-password.dto';
import { ForgotPasswordDto } from '../application/dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('password')
  async registerPassword(@Body() dto: RegisterPasswordDto) {
    await this.authService.registerPassword(dto);

    return { message: 'Register password succesfully' };
  }

  @Public()
  @Post('password/forgot')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    this.authService.forgotPassword(dto);

    return { message: 'succes' };
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);

    return {
      message: 'Login successful',
      data: { token: result.token, user: AuthMapper.toHttp(result.user) },
    };
  }

  @Post('logout')
  logout(
    @CurrentUser() user: AuthenticatedUserEntity,
    @Req() req: AuthenticatedRequest,
  ) {
    this.authService.logout(user.id, req.token);

    return { message: 'Logout successfuly' };
  }

  @Put('password')
  async changePassword(
    @CurrentUser() user: AuthenticatedUserEntity,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(user.id, dto);

    return { message: 'Change password succesfully' };
  }
}
