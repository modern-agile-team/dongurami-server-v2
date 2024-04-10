import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { ClubCategoryItemDto } from '@src/apis/club-categories/dto/club-category-item.dto';
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
  async findAll(
    @Query() findClubCategoryListQueryDto: FindClubCategoryListQueryDto,
  ): Promise<ClubCategoryItemDto[]> {
    const clubCategories = await this.clubCategoriesService.findAll(
      findClubCategoryListQueryDto,
    );

    return plainToInstance(ClubCategoryItemDto, clubCategories);
  }
}
