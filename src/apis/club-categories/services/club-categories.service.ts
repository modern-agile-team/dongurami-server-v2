import { Injectable } from '@nestjs/common';

import { CreateClubCategoryRequestBodyDto } from '@src/apis/club-categories/dto/create-club-category-request-body.dto';
import { ClubCategoryRepository } from '@src/apis/club-categories/repositories/club-category.repository';

@Injectable()
export class ClubCategoriesService {
  constructor(
    private readonly clubCategoryRepository: ClubCategoryRepository,
  ) {}

  create(createClubCategoryRequestBodyDto: CreateClubCategoryRequestBodyDto) {}
}
