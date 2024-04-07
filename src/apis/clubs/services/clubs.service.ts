import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { ClubCategoryRepository } from '@src/apis/club-categories/repositories/club-category.repository';
import { ClubCategoryLinkRepository } from '@src/apis/club-category-links/repositories/club-category-link.repository';
import { ClubTagLinkRepository } from '@src/apis/club-tag-links/repositories/club-tag-link.repository';
import { ClubTagDto } from '@src/apis/club-tags/dto/club-tag.dto';
import { ClubTagsService } from '@src/apis/club-tags/services/club-tags.service';
import { ClubStatus } from '@src/apis/clubs/constants/club.enum';
import { ClubWithCategoryAndTagDto } from '@src/apis/clubs/dto/club-with-category-and-tag.dto';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { CreateClubCategoryLinkDto } from '@src/apis/clubs/dto/create-club-category-link.dto';
import { CreateClubRequestBodyDto } from '@src/apis/clubs/dto/create-club-request-body.dto';
import { CreateClubTagLinkDto } from '@src/apis/clubs/dto/create-club-tag-link.dto';
import { FindClubListQueryDto } from '@src/apis/clubs/dto/find-club-list-query.dto';
import { ClubRepository } from '@src/apis/clubs/repositories/club.repository';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { Club } from '@src/entities/Club';
import { ClubCategoryLink } from '@src/entities/ClubCategoryLink';
import { ClubTagLink } from '@src/entities/ClubTagLink';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { HttpUnprocessableEntityException } from '@src/http-exceptions/exceptions/http-unprocessable-entity.exception';

@Injectable()
export class ClubsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<ClubDto, 'name'>)[] =
    ['name'];
  constructor(
    private readonly clubRepository: ClubRepository,
    private readonly clubCategoryLinkRepository: ClubCategoryLinkRepository,
    private readonly clubTagLinkRepository: ClubTagLinkRepository,
    private readonly clubCategoryRepository: ClubCategoryRepository,
    private readonly clubTagsService: ClubTagsService,
    private readonly queryHelper: QueryHelper,
  ) {}

  @Transactional()
  async create(
    userId: number,
    createClubRequestBodyDto: CreateClubRequestBodyDto,
  ): Promise<ClubWithCategoryAndTagDto> {
    const { name, introduce, logoPath, tagNames, categoryNames, status } =
      createClubRequestBodyDto;

    const existClubCategories = await this.clubCategoryRepository.find({
      where: {
        name: In(categoryNames),
      },
    });

    const existClubCategoryNamesSet = new Set(
      existClubCategories.map((category) => category.name),
    );

    const notExistClubCategoryNames = categoryNames.filter(
      (categoryName) => !existClubCategoryNamesSet.has(categoryName),
    );

    if (notExistClubCategoryNames.length) {
      throw new HttpUnprocessableEntityException({
        code: COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
        errors: notExistClubCategoryNames.map(
          (name) => `The category ${name} does not exist.`,
        ),
      });
    }

    const newClub = await this.clubRepository.save({
      userId,
      name,
      introduce,
      logoPath,
      status,
    });

    const clubTags = tagNames.length
      ? await this.clubTagsService.bulkCreate(userId, {
          names: tagNames,
        })
      : [];

    await this.bulkCreateClubTagLinks(
      clubTags.map((clubTag) => {
        return {
          userId,
          clubTagId: clubTag.id,
          clubId: newClub.id,
        };
      }),
    );

    await this.bulkCreateClubCategoryLinks(
      existClubCategories.map((clubCategory) => {
        return {
          userId,
          clubId: newClub.id,
          clubCategoryId: clubCategory.id,
        };
      }),
    );

    return new ClubWithCategoryAndTagDto({
      ...newClub,
      clubTags: plainToInstance(ClubTagDto, clubTags),
      clubCategories: plainToInstance(ClubCategoryDto, existClubCategories),
    });
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

  async findOneOrNotFound(clubId: number): Promise<ClubDto> {
    const existClub = await this.clubRepository.findOneBy({
      id: clubId,
      status: ClubStatus.Active,
    });

    if (!existClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new ClubDto(existClub);
  }

  async bulkCreateClubTagLinks(
    createClubTagLinkDtos: CreateClubTagLinkDto[],
  ): Promise<ClubTagLink[]> {
    if (!createClubTagLinkDtos.length) {
      return [];
    }

    const newClubTagLinks = this.clubTagLinkRepository.create(
      createClubTagLinkDtos.map((createClubTagLinkDto) => {
        const { userId, clubId, clubTagId } = createClubTagLinkDto;

        return {
          userId,
          clubId,
          clubTagId,
        };
      }),
    );

    await this.clubTagLinkRepository.insert(newClubTagLinks);

    return newClubTagLinks;
  }

  @Transactional()
  async bulkRemoveClubTagLinks(
    clubId: number,
    tagIds: number[],
  ): Promise<number> {
    const isExistClub = await this.clubRepository.exist({
      where: { id: clubId },
    });

    if (!isExistClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    const uniqueTagIds = [...new Set(tagIds)];

    const { affected } = await this.clubTagLinkRepository.delete({
      clubId,
      clubTagId: In(uniqueTagIds),
    });

    if (affected !== uniqueTagIds.length) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return affected;
  }

  async bulkCreateClubCategoryLinks(
    createClubCategoryLinkDtos: CreateClubCategoryLinkDto[],
  ): Promise<ClubCategoryLink[]> {
    if (!createClubCategoryLinkDtos.length) {
      return [];
    }

    const newClubCategoryLinks = this.clubCategoryLinkRepository.create(
      createClubCategoryLinkDtos.map((createClubCategoryLinkDto) => {
        const { userId, clubId, clubCategoryId } = createClubCategoryLinkDto;

        return {
          userId,
          clubId,
          clubCategoryId,
        };
      }),
    );

    await this.clubCategoryLinkRepository.insert(newClubCategoryLinks);

    return newClubCategoryLinks;
  }
}
