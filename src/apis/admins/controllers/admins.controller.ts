import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAdmins } from '@src/apis/admins/controllers/admins.swagger';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { CreateClubRequestBodyDto } from '@src/apis/clubs/dto/create-club-request-body.dto';
import { ClubsService } from '@src/apis/clubs/services/clubs.service';
import { CreateMajorRequestBodyDto } from '@src/apis/major/dto/create-major-request-body.dto';
import { MajorDto } from '@src/apis/major/dto/major.dto';
import { MajorService } from '@src/apis/major/services/major.service';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { User } from '@src/decorators/user.decorator';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';
import { DetailResponse } from '@src/interceptors/success-interceptor/types/success-interceptor.type';

@ApiTags('_admin')
@ApiCommonResponse([
  HttpStatus.UNAUTHORIZED,
  HttpStatus.FORBIDDEN,
  HttpStatus.INTERNAL_SERVER_ERROR,
])
@Controller('admins')
export class AdminsController {
  constructor(
    private readonly majorsService: MajorService,
    private readonly clubsService: ClubsService,
  ) {}

  /**
   * @todo 관리자만 사용 가능하게 해야함
   */
  @ApiAdmins.CreateNewMajor({
    summary: '전공 코드 및 이름 생성',
    description: '관리자만 사용 가능하게끔 설정돼있지 않음 추후 추가 에정',
  })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ type: ResponseType.Detail, key: 'major' })
  @Post('majors')
  createNewMajor(
    @Body() createMajorRequestBodyDto: CreateMajorRequestBodyDto,
  ): DetailResponse<MajorDto> {
    return this.majorsService.create(createMajorRequestBodyDto);
  }

  @ApiAdmins.CreateNewClub({
    summary: '동아리 생성',
    description: '관리자만 사용 가능하게끔 설정돼있지 않음 추후 추가 예정',
  })
  @UseGuards(JwtAuthGuard)
  @SetResponse({ type: ResponseType.Detail, key: 'club' })
  @Post('clubs')
  createNewClub(
    @User() user: UserDto,
    @Body() createClubRequestBodyDto: CreateClubRequestBodyDto,
  ) {
    return this.clubsService.create(user.id, createClubRequestBodyDto);
  }
}
