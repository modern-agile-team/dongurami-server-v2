import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiRoot } from '@src/apis/root/controllers/root.swagger';
import { RootService } from '@src/apis/root/services/root.service';

@ApiTags('root')
@Controller()
export class RootController {
  constructor(private readonly rootService: RootService) {}

  @ApiRoot.FindAllErrorCode({
    summary: '개발용으로 생성된 에러코드 전체조회',
    description: '서버에서 관리하는 에러코드를 조회합니다.',
  })
  @Get('error-code')
  findAllErrorCode() {
    return this.rootService.findAllErrorCode();
  }
}
