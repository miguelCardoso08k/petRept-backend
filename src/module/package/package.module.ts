import { Module } from '@nestjs/common';
import { InfrastructureController } from './infrastructure/package.controller';
import { PackageService } from './application/package.service';

@Module({
  controllers: [InfrastructureController],
  providers: [PackageService],
})
export class PackageModule {}
