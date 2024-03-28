import { Injectable } from '@nestjs/common';

import { ClubCategoryRepository } from '@src/apis/club-categories/repositories/club-category.repository';

@Injectable()
export class ClubCategoriesService {
  constructor(
    private readonly clubCategoryRepository: ClubCategoryRepository,
  ) {}
}
