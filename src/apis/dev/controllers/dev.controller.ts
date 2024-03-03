import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '@src/apis/auth/services/auth.service';
import { ApiDev } from '@src/apis/dev/controllers/dev.swagger';
import { DevService } from '@src/apis/dev/services/dev.service';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';

@ApiTags('_dev')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('dev')
export class DevController {
  constructor(
    private readonly authService: AuthService,
    private readonly devService: DevService,
  ) {}

  @ApiDev.GetAccessToken({
    summary: '개발용으로 생성된 accessToken 생성 api',
    description: '개발 환경에서만 사용 가능',
  })
  @Get('access-token/:userId')
  getAccessToken(@Param('userId', ParsePositiveIntPipe) userId: number) {
    return this.authService.generateToken({ id: userId });
  }

  @ApiDev.FindAllErrorCode({
    summary: '개발용으로 생성된 에러코드 전체조회',
    description: '서버에서 관리하는 에러코드를 조회합니다.',
  })
  @Get('error-code')
  findAllErrorCode() {
    return this.devService.findAllErrorCode();
  }
}
