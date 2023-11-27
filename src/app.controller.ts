import { Controller, Get } from '@nestjs/common';
import { AppService } from '@src/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('error-code')
  findAllErrorCode() {
    return this.appService.findAllErrorCode();
  }
}
