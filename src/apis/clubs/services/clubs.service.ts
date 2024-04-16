import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { differenceWith } from 'lodash';
import { In, Raw } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ClubApplicationFormDto } from '@src/apis/club-application-form/dto/club-application-form.dto';
import { CreateClubApplicationFormDto } from '@src/apis/club-application-form/dto/create-club-application-form.dto';
import { PutUpdateClubApplicationFormDto } from '@src/apis/club-application-form/dto/put-update-club-application-form.dto';
import { ClubApplicationFormService } from '@src/apis/club-application-form/services/club-application-form.service';
import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { ClubCategoryRepository } from '@src/apis/club-categories/repositories/club-category.repository';
import { ClubCategoryLinkRepository } from '@src/apis/club-category-links/repositories/club-category-link.repository';
import { ClubMemberItemDto } from '@src/apis/club-members/dto/club-member-item.dto';
import { ClubMembersService } from '@src/apis/club-members/services/club-members.service';
import { ClubPostTagLinkRepository } from '@src/apis/club-post-tag-links/repositories/club-post-tag-link.repository';
import { CreateClubPostTagDto } from '@src/apis/club-post-tags/dto/create-club-post-tag.dto';
import { ClubPostTagsService } from '@src/apis/club-post-tags/services/club-post-tags.service';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { CreateClubPostDto } from '@src/apis/club-posts/dto/create-club-post.dto';
import { ClubPostsService } from '@src/apis/club-posts/services/club-posts.service';
import { ClubTagLinkRepository } from '@src/apis/club-tag-links/repositories/club-tag-link.repository';
import { ClubTagDto } from '@src/apis/club-tags/dto/club-tag.dto';
import { ClubTagsService } from '@src/apis/club-tags/services/club-tags.service';
import { ClubStatus } from '@src/apis/clubs/constants/club.enum';
import { BulkAppendClubTagDto } from '@src/apis/clubs/dto/bulk-append-club-tag.dto';
import { ClubWithCategoryAndTagDto } from '@src/apis/clubs/dto/club-with-category-and-tag.dto';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { ClubsItemDto } from '@src/apis/clubs/dto/clubs-item.dto';
import { CreateClubCategoryLinkDto } from '@src/apis/clubs/dto/create-club-category-link.dto';
import { CreateClubPostRequestBodyDto } from '@src/apis/clubs/dto/create-club-post-request-body.dto';
import { CreateClubPostTagLinkDto } from '@src/apis/clubs/dto/create-club-post-tag-link.dto';
import { CreateClubRequestBodyDto } from '@src/apis/clubs/dto/create-club-request-body.dto';
import { CreateClubTagLinkDto } from '@src/apis/clubs/dto/create-club-tag-link.dto';
import { FindClubListQueryDto } from '@src/apis/clubs/dto/find-club-list-query.dto';
import { ClubRepository } from '@src/apis/clubs/repositories/club.repository';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ClubCategoryLink } from '@src/entities/ClubCategoryLink';
import { ClubPostTagLink } from '@src/entities/ClubPostTagLink';
import { ClubTagLink } from '@src/entities/ClubTagLink';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { HttpUnprocessableEntityException } from '@src/http-exceptions/exceptions/http-unprocessable-entity.exception';

@Injectable()
export class ClubsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<ClubDto, 'name'>)[] =
    ['name'];
  constructor(
    private readonly clubMembersService: ClubMembersService,
    private readonly clubRepository: ClubRepository,
    private readonly clubCategoryLinkRepository: ClubCategoryLinkRepository,
    private readonly clubTagLinkRepository: ClubTagLinkRepository,
    private readonly clubCategoryRepository: ClubCategoryRepository,
    private readonly clubTagsService: ClubTagsService,
    private readonly clubPostsService: ClubPostsService,
    private readonly clubApplicationFormService: ClubApplicationFormService,
    private readonly clubPostTagsService: ClubPostTagsService,
    private readonly clubPostTagLinkRepository: ClubPostTagLinkRepository,
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

    const clubTags = tagNames.length
      ? await this.clubTagsService.bulkCreate(userId, {
          names: tagNames,
        })
      : [];

    const newClub = await this.clubRepository.save({
      userId,
      name,
      introduce,
      logoPath,
      status,
      tags: clubTags,
    });

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

    await this.clubApplicationFormService.create(
      newClub.id,
      userId,
      new CreateClubApplicationFormDto({
        customQuestion: [],
        startsAt: null,
        endsAt: null,
      }),
    );

    return new ClubWithCategoryAndTagDto({
      ...newClub,
      clubTags: plainToInstance(ClubTagDto, clubTags),
      clubCategories: plainToInstance(ClubCategoryDto, existClubCategories),
    });
  }

  async findAllAndCount(
    findClubListQueryDto: FindClubListQueryDto,
  ): Promise<[ClubsItemDto[], number]> {
    const { page, pageSize, order, categoryId, tagId, ...filter } =
      findClubListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    const [clubs, count] = await this.clubRepository.findAndCount({
      select: {
        id: true,
        userId: true,
        name: true,
        logoPath: true,
        status: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        ...where,
        tags:
          tagId &&
          Raw(
            (columnAlias) =>
              `JSON_CONTAINS(${columnAlias}, '${JSON.stringify({
                id: tagId,
              })}')`,
          ),
        clubCategoryLinks: {
          clubCategoryId: categoryId,
        },
      },
      order,
      skip: page * pageSize,
      take: pageSize,
      relations: {
        clubCategoryLinks: {
          clubCategory: true,
        },
      },
    });

    return [
      clubs.map((club) => {
        const {
          id,
          userId,
          name,
          logoPath,
          status,
          tags,
          createdAt,
          updatedAt,
          clubCategoryLinks,
        } = club;

        return {
          id,
          userId,
          name,
          logoPath,
          status,
          createdAt,
          updatedAt,
          clubTags: tags,
          clubCategories: clubCategoryLinks.map(
            (clubCategoryLink) => clubCategoryLink.clubCategory,
          ),
        };
      }),
      count,
    ];
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

  async findAllMembers(clubId: number): Promise<ClubMemberItemDto[]> {
    const isExistClub = await this.clubRepository.exist({
      where: { id: clubId },
    });

    if (!isExistClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return this.clubMembersService.findAllByClubId(clubId);
  }

  async findAllTags(clubId: number): Promise<ClubTagDto[]> {
    const isExistClub = await this.clubRepository.exist({
      where: { id: clubId },
    });

    if (!isExistClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    const clubTagLinks = await this.clubTagLinkRepository.find({
      select: {
        id: true,
      },
      where: {
        clubId,
      },
      relations: {
        clubTag: true,
      },
    });

    return clubTagLinks.map((clubTagLink) => {
      return new ClubTagDto(clubTagLink.clubTag);
    });
  }

  @Transactional()
  async bulkAppendTags(
    userId: number,
    clubId: number,
    bulkAppendClubTagDto: BulkAppendClubTagDto,
  ): Promise<ClubTagDto[]> {
    const isExistClub = await this.clubRepository.exist({
      where: {
        id: clubId,
      },
    });

    if (!isExistClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    const tags = await this.clubTagsService.bulkCreate(userId, {
      names: bulkAppendClubTagDto.tagNames,
    });

    const createClubTagLinkDtos = tags.map(
      (tag) => new CreateClubTagLinkDto({ userId, clubId, clubTagId: tag.id }),
    );

    await this.bulkCreateClubTagLinks(createClubTagLinkDtos);

    await this.syncTagLinkFromMapping(clubId);

    return tags;
  }

  async bulkCreateClubTagLinks(
    createClubTagLinkDtos: CreateClubTagLinkDto[],
  ): Promise<ClubTagLink[]> {
    if (!createClubTagLinkDtos.length) {
      return [];
    }

    const existClubTagLinks = await this.clubTagLinkRepository.findBy({
      clubId: In([...new Set(createClubTagLinkDtos.map((el) => el.clubId))]),
    });

    const newClubTagLinks = differenceWith(
      createClubTagLinkDtos,
      existClubTagLinks,
      (a, b) => {
        return a.clubId === b.clubId && a.clubTagId === b.clubTagId;
      },
    ).map((createClubTagLinkDto) => {
      const { userId, clubId, clubTagId } = createClubTagLinkDto;

      return this.clubTagLinkRepository.create({
        userId,
        clubId,
        clubTagId,
      });
    });

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

    await this.syncTagLinkFromMapping(clubId);

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

  async findAllCategoryByClubId(clubId: number): Promise<ClubCategoryDto[]> {
    const isExistClub = await this.clubRepository.exist({
      where: {
        id: clubId,
        status: ClubStatus.Active,
      },
    });

    if (!isExistClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    const clubCategoryLinks = await this.clubCategoryLinkRepository.find({
      select: {
        id: true,
      },
      where: {
        clubId,
      },
      relations: {
        clubCategory: true,
      },
    });

    return clubCategoryLinks.map((clubCategoryLink) => {
      const { id, userId, name, createdAt } = clubCategoryLink.clubCategory;

      return new ClubCategoryDto({
        id,
        userId,
        name,
        createdAt,
      });
    });
  }

  @Transactional()
  async createClubPost(
    userId: number,
    clubId: number,
    createClubPostRequestBodyDto: CreateClubPostRequestBodyDto,
  ): Promise<ClubPostDto> {
    const { tagNames } = createClubPostRequestBodyDto;

    const isExistClub = await this.clubRepository.exist({
      where: {
        id: clubId,
      },
    });

    if (!isExistClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    const isExistClubMember = await this.clubMembersService.isExistClubMember(
      clubId,
      userId,
    );

    /**
     * @todo 추후 guard를 통해 access control 되도록 변경
     */
    if (!isExistClubMember) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const newClubPostTags = await this.clubPostTagsService.bulkCreate(
      userId,
      tagNames.map((name) => new CreateClubPostTagDto({ name })),
    );

    const newClubPost = await this.clubPostsService.create(
      new CreateClubPostDto({
        ...createClubPostRequestBodyDto,
        userId,
        clubId,
        tags: newClubPostTags,
      }),
    );

    await this.bulkCreateClubPostTagLinks(
      newClubPostTags.map(
        (newClubPostTag) =>
          new CreateClubPostTagLinkDto({
            userId,
            clubPostId: newClubPost.id,
            clubPostTagId: newClubPostTag.id,
          }),
      ),
    );

    return newClubPost;
  }

  async findLatestApplicationForm(
    clubId: number,
  ): Promise<ClubApplicationFormDto> {
    const isExistClub = await this.clubRepository.exist({
      where: { id: clubId },
    });

    if (!isExistClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    const latestApplicationForm =
      await this.clubApplicationFormService.findLatestByClubId(clubId);

    if (latestApplicationForm === undefined) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '동아리는 존재하지만 동아리 지원서 폼이 존재하지 않음',
        stack: new Error().stack,
      });
    }

    return latestApplicationForm;
  }

  async bulkCreateClubPostTagLinks(
    createClubPostTagLinkDtos: CreateClubPostTagLinkDto[],
  ): Promise<ClubPostTagLink[]> {
    if (!createClubPostTagLinkDtos.length) {
      return [];
    }

    const existClubPostTagLinks = await this.clubPostTagLinkRepository.findBy({
      clubPostId: In([
        ...new Set(createClubPostTagLinkDtos.map((el) => el.clubPostId)),
      ]),
    });

    const newClubPostTagLinks = differenceWith(
      createClubPostTagLinkDtos,
      existClubPostTagLinks,
      (a, b) => {
        return (
          a.clubPostId === b.clubPostId && a.clubPostTagId === b.clubPostTagId
        );
      },
    ).map((createClubPostTagLinkDto: CreateClubPostTagLinkDto) => {
      const { userId, clubPostId, clubPostTagId } = createClubPostTagLinkDto;

      return this.clubPostTagLinkRepository.create({
        userId,
        clubPostId,
        clubPostTagId,
      });
    });

    await this.clubPostTagLinkRepository.insert(newClubPostTagLinks);

    return newClubPostTagLinks;
  }

  async putUpdateClubApplicationForm(
    userId: number,
    clubId: number,
    formId: number,
    putUpdateClubApplicationFormDto: PutUpdateClubApplicationFormDto,
  ): Promise<ClubApplicationFormDto> {
    const isExistClub = await this.clubRepository.exist({
      where: { id: clubId },
    });

    if (!isExistClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return this.clubApplicationFormService.putUpdate(
      userId,
      formId,
      putUpdateClubApplicationFormDto,
    );
  }

  private async syncTagLinkFromMapping(clubId: number): Promise<ClubTagDto[]> {
    const tagLinks = await this.clubTagLinkRepository.find({
      select: {
        id: true,
      },
      relations: {
        clubTag: true,
      },
      where: {
        clubId,
      },
    });

    const tags = tagLinks.map((tagLink) => new ClubTagDto(tagLink.clubTag));

    await this.clubRepository.update(
      {
        id: clubId,
      },
      {
        tags,
      },
    );

    return tags;
  }
}
