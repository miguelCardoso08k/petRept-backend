import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './module/auth/infrastructure/decorators/public.decorator';

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
