import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { AuthGuard } from './module/auth/infrastructure/guards/auth.guard';
import { RoleGuard } from './module/auth/infrastructure/guards/role.guard';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
