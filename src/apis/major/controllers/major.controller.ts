import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMajorRequestBodyDto } from '../dto/create-major-request-body.dto';
import { MajorDto } from '../dto/major.dto';
import { MajorService } from '../services/major.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiMajors } from './major.swagger';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { DetailResponse } from '@src/interceptors/success-interceptor/types/success-interceptor.type';

@ApiTags('major')
@Controller('major')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @ApiMajors.GetAllMajors({ summary: '전공 목록 전체 조회' })
  @SetResponse({ type: ResponseType.Common, key: 'majors' })
  @Get()
  getAllMajors() {
    return this.majorService.getAllMajors();
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
