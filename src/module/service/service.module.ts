import { Module } from '@nestjs/common';
import { ApplicationService } from './application/service.service';
import { InfrastructureController } from './infrastructure/infrastructure.controller';

@Module({
  controllers: [InfrastructureController],
  providers: [ApplicationService],
})
export class ServiceModule {}
