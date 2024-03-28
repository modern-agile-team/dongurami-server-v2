import { Injectable } from '@nestjs/common';

import { CreateClubCategoryLinkDto } from '@src/apis/club-category-links/dto/create-club-category-link.dto';
import { ClubCategoryLinkRepository } from '@src/apis/club-category-links/repositories/club-category-link.repository';

@Injectable()
export class ClubCategoryLinksService {
  constructor(
    private readonly clubCategoryLinkRepository: ClubCategoryLinkRepository,
  ) {}

  async create(
    createClubCategoryLinkDtos: CreateClubCategoryLinkDto[],
  ): Promise<void> {
    await this.clubCategoryLinkRepository.save(
      this.clubCategoryLinkRepository.create(createClubCategoryLinkDtos),
    );
  }
}
