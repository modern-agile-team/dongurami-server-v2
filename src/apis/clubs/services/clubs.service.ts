import { Injectable } from '@nestjs/common';

import { In } from 'typeorm';

import { ClubCategoryLinkRepository } from '@src/apis/club-category-links/repositories/club-category-link.repository';
import { ClubTagLinkRepository } from '@src/apis/club-tag-links/repositories/club-tag-link.repository';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { FindClubListQueryDto } from '@src/apis/clubs/dto/find-club-list-query.dto';
import { ClubRepository } from '@src/apis/clubs/repositories/club.repository';
import { Club } from '@src/entities/Club';
import { QueryHelper } from '@src/helpers/query.helper';

@Injectable()
export class ClubsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<ClubDto, 'name'>)[] =
    ['name'];
  constructor(
    private readonly clubRepository: ClubRepository,
    private readonly clubCategoryLinkRepository: ClubCategoryLinkRepository,
    private readonly clubTagLinkRepository: ClubTagLinkRepository,
    private readonly queryHelper: QueryHelper,
  ) {}

  /**
   * 카테고리 및 태그 필터링때문에 다소 복잡하게 짜여져있음
   * 추후 성능이슈가 없는지 검토해볼 필요가 있음
   */
  async findAllAndCount(
    findClubListQueryDto: FindClubListQueryDto,
  ): Promise<[Club[], number]> {
    const { page, pageSize, order, categoryId, tagId, ...filter } =
      findClubListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    const [clubs, count] = await this.clubRepository.findAndCount({
      select: {
        id: true,
        name: true,
        logoPath: true,
        status: true,
      },
      where: {
        ...where,
        clubCategoryLinks: {
          clubCategoryId: categoryId,
        },
        clubTagLinks: {
          clubTagId: tagId,
        },
      },
      order,
      skip: page * pageSize,
      take: pageSize,
    });

    const clubIds = clubs.map((club) => club.id);

    const [clubCategoryLinks, clubTagLinks] = await Promise.all([
      this.clubCategoryLinkRepository.find({
        where: {
          clubId: In(clubIds),
        },
        relations: {
          clubCategory: true,
        },
      }),
      this.clubTagLinkRepository.find({
        where: {
          clubId: In(clubIds),
        },
        relations: {
          clubTag: true,
        },
      }),
    ]);

    const clubMap = new Map(clubs.map((club) => [club.id, club]));

    clubs.forEach((club) => {
      club.clubCategoryLinks = [];
      club.clubTagLinks = [];
    });

    clubCategoryLinks.forEach((clubCategoryLink) => {
      const club = clubMap.get(clubCategoryLink.clubId);
      club.clubCategoryLinks.push(clubCategoryLink);
    });
    clubTagLinks.forEach((clubTagLink) => {
      const club = clubMap.get(clubTagLink.clubId);
      club.clubTagLinks.push(clubTagLink);
    });

    return [clubs, count];
  }
}