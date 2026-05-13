import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from './application/auth.service';
import { PasswordHasherRepository } from './domain/repositories/password-hasher.repository';
import { TokenRepository } from './domain/repositories/token.repository';
import { AuthController } from './infrastructure/auth.controller';
import { BcryptPasswordHasherRepository } from './infrastructure/bcrypt-password-hasher.repository';
import { JwtTokenRepository } from './infrastructure/jwt-token.repository';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: PasswordHasherRepository,
      useClass: BcryptPasswordHasherRepository,
    },
    { provide: TokenRepository, useClass: JwtTokenRepository },
  ],
  exports: [TokenRepository],
})
export class AuthModule {}
