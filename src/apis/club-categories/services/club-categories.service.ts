import { Injectable } from '@nestjs/common';

import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { CreateClubCategoryRequestBodyDto } from '@src/apis/club-categories/dto/create-club-category-request-body.dto';
import { ClubCategoryRepository } from '@src/apis/club-categories/repositories/club-category.repository';
import { CLUB_CATEGORY_ERROR_CODE } from '@src/constants/error/club-category/club-category-error-code.constant';
import { ClubCategory } from '@src/entities/ClubCategory';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';

@Injectable()
export class ClubCategoriesService {
  constructor(
    private readonly clubCategoryRepository: ClubCategoryRepository,
  ) {}

  async create(
    userId: number,
    createClubCategoryRequestBodyDto: CreateClubCategoryRequestBodyDto,
  ): Promise<ClubCategoryDto> {
    const { name, memo } = createClubCategoryRequestBodyDto;

    const existClubCategory: Pick<ClubCategory, 'name'> =
      await this.clubCategoryRepository.findOne({
        select: ['name'],
        where: { name },
      });

    if (existClubCategory) {
      throw new HttpConflictException({
        code: CLUB_CATEGORY_ERROR_CODE.ALREADY_EXIST_CLUB_CATEGORY_NAME,
      });
    }

    const newClubCategory = await this.clubCategoryRepository.save({
      userId,
      name,
      memo,
    });

    return new ClubCategoryDto(newClubCategory);
  }

  findAll() {}
}
