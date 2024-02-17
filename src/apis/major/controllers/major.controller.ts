import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiMajors } from '@src/apis/major/controllers/major.swagger';
import { CreateMajorRequestBodyDto } from '@src/apis/major/dto/create-major-request-body.dto';
import { MajorDto } from '@src/apis/major/dto/major.dto';
import { MajorService } from '@src/apis/major/services/major.service';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { DetailResponse } from '@src/interceptors/success-interceptor/types/success-interceptor.type';

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

  /**
   * @todo 관리자만 사용 가능합니다.
   */
  @ApiMajors.CreateNewMajor({ summary: '전공 코드 및 이름 생성' })
  @SetResponse({ type: ResponseType.Detail, key: 'major' })
  @Post()
  createNewMajor(
    @Body() createMajorRequestBodyDto: CreateMajorRequestBodyDto,
  ): DetailResponse<MajorDto> {
    return this.majorService.create(createMajorRequestBodyDto);
  }
}
