import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getHello(): string {
    return '欢迎访问Nest-Xlboy-Service';
  }
}
