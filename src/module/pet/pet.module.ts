import { Module } from '@nestjs/common';
import { PetService } from './application/pet.service';
import { PetController } from './infrastructure/pet.controller';

@Module({
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule {}
