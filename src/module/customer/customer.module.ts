import { Module } from '@nestjs/common';
import { CustomerServiceService } from './application/customer.service.service';
import { CustomerController } from './infrastructure/customer.controller';

@Module({
  controllers: [CustomerController],
  providers: [CustomerServiceService],
})
export class CustomerModule {}
