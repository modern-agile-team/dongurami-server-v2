import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiMajors } from '@src/apis/major/controllers/major.swagger';
import { MajorService } from '@src/apis/major/services/major.service';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';

@ApiTags('majors')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('major')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @ApiMajors.FindAllMajors({ summary: '전공 목록 전체 조회' })
  @SetResponse({ type: ResponseType.Common, key: 'majors' })
  @Get()
  findAllMajors() {
    return this.majorService.findAllMajors();
  }
}
