import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { ApiClub } from '@src/apis/clubs/controllers/clubs.swagger';
import { ClubsItemDto } from '@src/apis/clubs/dto/clubs-item.dto';
import { FindClubListQueryDto } from '@src/apis/clubs/dto/find-club-list-query.dto';
import { ClubsService } from '@src/apis/clubs/services/clubs.service';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';

@ApiTags('club')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @ApiClub.FindAllAndCount({ summary: '동아리 리스트 조회' })
  @SetResponse({ key: 'clubs', type: ResponseType.Pagination })
  @Get()
  async findAllAndCount(@Query() findClubListQueryDto: FindClubListQueryDto) {
    const [clubs, count] =
      await this.clubsService.findAllAndCount(findClubListQueryDto);

    return [plainToInstance(ClubsItemDto, clubs), count];
  }
}
