import { Module } from '@nestjs/common';

import { PrismaModule } from '../../core/config/prisma/prisma.module';
import { UserService } from './application/user.service';
import { UserRepository } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository';
import { UserController } from './infrastructure/user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: UserRepository, useClass: PrismaUserRepository },
  ],
  exports: [UserRepository],
})
export class UserModule {}
