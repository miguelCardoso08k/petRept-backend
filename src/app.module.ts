import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { AuthGuard } from './module/auth/infrastructure/guards/auth.guard';
import { RoleGuard } from './module/auth/infrastructure/guards/role.guard';
import { UserModule } from './module/user/user.module';
import { CustomerModule } from './module/customer/customer.module';
import { PetModule } from './module/pet/pet.module';
import { PackageModule } from './module/package/package.module';
import { ServiceModule } from './module/service/service.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    CustomerModule,
    PetModule,
    PackageModule,
    ServiceModule,
  ],
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
