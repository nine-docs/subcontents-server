import { Controller, Get } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  hello(@Query('name') name: string = 'World') {
    return this.appService.getHello(name);
  }
}
