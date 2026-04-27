import { Module } from '@nestjs/common';

import { UserController } from './infrastructure/user.controller';
import { UserService } from './application/user.service';
import { UserRepository } from './domain/repositories/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserRepository],
})
export class UserModule {}
