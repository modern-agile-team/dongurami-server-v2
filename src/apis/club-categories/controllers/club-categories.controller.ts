import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindClubCategoryListQueryDto } from '@src/apis/club-categories/dto/find-club-category-list-query.dto';
import { ClubCategoriesService } from '@src/apis/club-categories/services/club-categories.service';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';

@ApiTags('club-category')
@ApiCommonResponse([HttpStatus.INTERNAL_SERVER_ERROR])
@Controller('club-categories')
export class ClubCategoriesController {
  constructor(private readonly clubCategoriesService: ClubCategoriesService) {}

  @Get()
  @SetResponse({ type: ResponseType.Common, key: 'clubCategories' })
  findAll(@Query() findClubCategoryListQueryDto: FindClubCategoryListQueryDto) {
    this.clubCategoriesService;
  }
}
