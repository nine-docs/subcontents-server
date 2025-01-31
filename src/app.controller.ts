import { Controller, Get } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api/v1/subcontents/health')
  hello() {
    return {
      success: true,
    };
  }
}
