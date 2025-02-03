import { Controller, Get } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  hello() {
    return {
      success: true,
    };
  }
}
