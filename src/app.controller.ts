import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '@src/app.service';
import { ApiRoot } from '@src/app.swagger';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiRoot.FindAllErrorCode({
    summary: '개발용으로 생성된 에러코드 전체조회',
    description: '서버에서 관리하는 에러코드를 조회합니다.',
  })
  @Get('error-code')
  findAllErrorCode() {
    return this.appService.findAllErrorCode();
  }
}
