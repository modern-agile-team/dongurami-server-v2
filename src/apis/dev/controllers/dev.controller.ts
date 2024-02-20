import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from '@src/apis/auth/services/auth.service';
import { ApiDev } from '@src/apis/dev/controllers/dev.swagger';
import { ParsePositiveIntPipe } from '@src/pipes/parse-positive-int.pipe';

@ApiTags('_dev')
@Controller('dev')
export class DevController {
  constructor(private readonly authService: AuthService) {}

  @ApiDev.GetAccessToken({ summary: '개발용으로 생성된 accessToken 생성 api' })
  @Get('access-token/:userId')
  getAccessToken(@Param('userId', ParsePositiveIntPipe) userId: number) {
    return this.authService.generateToken({ id: userId });
  }
}
