import { Injectable } from '@nestjs/common';

import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ClubCategoryRepository } from '@src/apis/club-categories/repositories/club-category.repository';
import { ClubCategoryLinkRepository } from '@src/apis/club-category-links/repositories/club-category-link.repository';
import { ClubTagLinkRepository } from '@src/apis/club-tag-links/repositories/club-tag-link.repository';
import { ClubTagRepository } from '@src/apis/club-tags/repositories/club-tag.repository';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { CreateClubRequestBodyDto } from '@src/apis/clubs/dto/create-club-request-body.dto';
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
    private readonly clubCategoryRepository: ClubCategoryRepository,
    private readonly clubTagRepository: ClubTagRepository,
    private readonly queryHelper: QueryHelper,
  ) {}

  @Transactional()
  async create(
    userId: number,
    createClubRequestBodyDto: CreateClubRequestBodyDto,
  ) {
    const { name, introduce, logoPath, tags, categories, status } =
      createClubRequestBodyDto;

    const [existClubCategories, existClubTags] = await Promise.all([
      this.clubCategoryRepository.find({
        where: {
          name: In(categories),
        },
      }),
      this.clubTagRepository.find({
        where: {
          name: In(tags),
        },
      }),
    ]);

    const existClubCategoryNames = existClubCategories.map(
      (existClubCategory) => existClubCategory.name,
    );
    const existClubTagNames = existClubTags.map(
      (existClubTag) => existClubTag.name,
    );

    const notExistClubCategoryNames = categories.filter(
      (category) => !existClubCategoryNames.includes(category),
    );
    const notExistClubTagNames = tags.filter(
      (tag) => !existClubTagNames.includes(tag),
    );

    const newClubCategories = this.clubCategoryRepository.create(
      notExistClubCategoryNames.map((categoryName) => {
        return { userId, name: categoryName, memo: '어라' };
      }),
    );

    const newClubTags = this.clubTagRepository.create(
      notExistClubTagNames.map((tagName) => {
        return { userId, name: tagName };
      }),
    );

    await Promise.all([
      this.clubCategoryRepository.save(newClubCategories),
      this.clubTagRepository.save(newClubTags),
    ]);

    const newClub = await this.clubRepository.save({
      userId,
      name,
      introduce,
      logoPath,
      status,
    });

    const newClubCategoryLinks = this.clubCategoryLinkRepository.create(
      existClubCategories.concat(newClubCategories).map((clubCategory) => {
        return {
          userId,
          clubId: newClub.id,
          clubCategoryId: clubCategory.id,
        };
      }),
    );

    const newClubTagLinks = this.clubTagLinkRepository.create(
      existClubTags.concat(newClubTags).map((clubTag) => {
        return {
          userId,
          clubId: newClub.id,
          clubTagId: clubTag.id,
        };
      }),
    );

    await Promise.all([
      this.clubCategoryLinkRepository.save(newClubCategoryLinks, {
        reload: false,
      }),
      this.clubTagLinkRepository.save(newClubTagLinks, { reload: false }),
    ]);

    return new ClubDto(newClub);
  }

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
