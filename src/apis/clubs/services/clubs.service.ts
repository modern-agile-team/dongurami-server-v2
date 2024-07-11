import { Injectable } from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { isNotEmptyObject } from 'class-validator';
import { differenceWith } from 'lodash';
import { getTsid } from 'tsid-ts';
import { In, Raw } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ClubApplicationFormDto } from '@src/apis/club-application-form/dto/club-application-form.dto';
import { CreateClubApplicationFormDto } from '@src/apis/club-application-form/dto/create-club-application-form.dto';
import { PutUpdateClubApplicationFormDto } from '@src/apis/club-application-form/dto/put-update-club-application-form.dto';
import { ClubApplicationFormService } from '@src/apis/club-application-form/services/club-application-form.service';
import { ClubApplicationStatus } from '@src/apis/club-applications/constants/club-application.enum';
import { ClubApplicationDto } from '@src/apis/club-applications/dto/club-application.dto';
import { ClubApplicationsItemDto } from '@src/apis/club-applications/dto/club-applications-item.dto';
import { CreateClubApplicationDto } from '@src/apis/club-applications/dto/create-club-application.dto';
import { FindClubApplicationListQueryDto } from '@src/apis/club-applications/dto/find-club-application-list-query.dto';
import { PatchUpdateClubApplicationDto } from '@src/apis/club-applications/dto/patch-update-club-application.dto';
import { UpdateClubApplicationStatusDto } from '@src/apis/club-applications/dto/update-club-application-status.dto';
import { ClubApplicationsService } from '@src/apis/club-applications/services/club-applications.service';
import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { ClubCategoryRepository } from '@src/apis/club-categories/repositories/club-category.repository';
import { ClubCategoryLinkRepository } from '@src/apis/club-category-links/repositories/club-category-link.repository';
import { ClubMemberRole } from '@src/apis/club-members/constants/club-member.enum';
import { ClubMemberItemDto } from '@src/apis/club-members/dto/club-member-item.dto';
import { ClubMembersService } from '@src/apis/club-members/services/club-members.service';
import { ClubPostCommentDto } from '@src/apis/club-post-comments/dto/club-post-comment.dto';
import { FindAndCountClubPostCommentsDto } from '@src/apis/club-post-comments/dto/find-and-count-club-post-comments.dto';
import { FindClubPostCommentsDto } from '@src/apis/club-post-comments/dto/find-club-post-comments.dto';
import { PatchUpdateClubPostCommentDto } from '@src/apis/club-post-comments/dto/patch-update-club-post-comment.dto';
import { RemoveClubPostCommentDto } from '@src/apis/club-post-comments/dto/remove-club-post-comment.dto';
import { ClubPostCommentsService } from '@src/apis/club-post-comments/services/club-post-comments.service';
import { ClubPostTagLinkRepository } from '@src/apis/club-post-tag-links/repositories/club-post-tag-link.repository';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { ClubPostsItemDto } from '@src/apis/club-posts/dto/club-posts-item.dto';
import { CreateClubPostDto } from '@src/apis/club-posts/dto/create-club-post.dto';
import { FindClubPostListQueryDto } from '@src/apis/club-posts/dto/find-club-post-list-query.dto';
import { PatchUpdateClubPostDto } from '@src/apis/club-posts/dto/patch-update-club-post.dto';
import { ClubPostsService } from '@src/apis/club-posts/services/club-posts.service';
import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { ClubReviewsItemDto } from '@src/apis/club-reviews/dto/club-reviews-item.dto';
import { CreateClubReviewDto } from '@src/apis/club-reviews/dto/create-club-review.dto';
import { FindClubReviewListQueryDto } from '@src/apis/club-reviews/dto/find-club-review-list-query.dto';
import { PatchUpdateClubReviewDto } from '@src/apis/club-reviews/dto/patch-update-club-review.dto';
import { RemoveClubReviewDto } from '@src/apis/club-reviews/dto/remove-club-review.dto';
import { ScoreDto } from '@src/apis/club-reviews/dto/score.dto';
import { ClubReviewsService } from '@src/apis/club-reviews/services/club-reviews.service';
import { ClubTagLinkRepository } from '@src/apis/club-tag-links/repositories/club-tag-link.repository';
import { ClubTagDto } from '@src/apis/club-tags/dto/club-tag.dto';
import { ClubTagsService } from '@src/apis/club-tags/services/club-tags.service';
import { ClubStatus } from '@src/apis/clubs/constants/club.enum';
import { BulkAppendClubTagDto } from '@src/apis/clubs/dto/bulk-append-club-tag.dto';
import { ClubWithCategoryAndTagDto } from '@src/apis/clubs/dto/club-with-category-and-tag.dto';
import { ClubDto } from '@src/apis/clubs/dto/club.dto';
import { ClubsItemDto } from '@src/apis/clubs/dto/clubs-item.dto';
import { CreateClubApplicationRequestBodyDto } from '@src/apis/clubs/dto/create-club-application-request-body.dto';
import { CreateClubCategoryLinkDto } from '@src/apis/clubs/dto/create-club-category-link.dto';
import { CreateClubPostCommentRequestBodyDto } from '@src/apis/clubs/dto/create-club-post-comment-request-body.dto';
import { CreateClubPostRequestBodyDto } from '@src/apis/clubs/dto/create-club-post-request-body.dto';
import { CreateClubPostTagLinkDto } from '@src/apis/clubs/dto/create-club-post-tag-link.dto';
import { CreateClubRequestBodyDto } from '@src/apis/clubs/dto/create-club-request-body.dto';
import { CreateClubReviewRequestBodyDto } from '@src/apis/clubs/dto/create-club-review-request-body.dto';
import { CreateClubTagLinkDto } from '@src/apis/clubs/dto/create-club-tag-link.dto';
import { FindClubApplicationListRequestQueryDto } from '@src/apis/clubs/dto/find-club-application-list-request-query.dto';
import { FindClubListQueryDto } from '@src/apis/clubs/dto/find-club-list-query.dto';
import { FindClubPostCommentsListRequestQueryDto } from '@src/apis/clubs/dto/find-club-post-comments-list-request-query.dto';
import { FindClubPostListRequestQueryDto } from '@src/apis/clubs/dto/find-club-post-list-request-query.dto';
import { FindClubReviewListRequestQueryDto } from '@src/apis/clubs/dto/find-club-review-list-request-query.dto';
import { PatchUpdateClubPostCommentRequestBodyDto } from '@src/apis/clubs/dto/patch-update-club-post-comment-request-body.dto';
import { PatchUpdateClubPostRequestBodyDto } from '@src/apis/clubs/dto/patch-update-club-post-request-body.dto';
import { PatchUpdateClubReviewRequestDto } from '@src/apis/clubs/dto/patch-update-club-review-request.dto';
import { ClubRepository } from '@src/apis/clubs/repositories/club.repository';
import { PostTagDto } from '@src/apis/post-tags/dto/post-tag.dto';
import { PostTagsService } from '@src/apis/post-tags/services/post-tags.service';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ClubCategoryLink } from '@src/entities/ClubCategoryLink';
import { ClubPostComment } from '@src/entities/ClubPostComment';
import { ClubPostTagLink } from '@src/entities/ClubPostTagLink';
import { ClubTagLink } from '@src/entities/ClubTagLink';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
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
    private readonly postTagsService: PostTagsService,
    private readonly clubPostTagLinkRepository: ClubPostTagLinkRepository,
    private readonly clubReviewsService: ClubReviewsService,
    private readonly clubApplicationsService: ClubApplicationsService,
    private readonly queryHelper: QueryHelper,
    private readonly clubPostCommentsService: ClubPostCommentsService,
  ) {}

  @Transactional()
  async create(
    userId: string,
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
      id: getTsid().toBigInt().toString(),
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

  async findOneOrNotFound(clubId: string): Promise<ClubDto> {
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

  async findAllMembers(clubId: string): Promise<ClubMemberItemDto[]> {
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

  async findAllTags(clubId: string): Promise<ClubTagDto[]> {
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
    userId: string,
    clubId: string,
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
        id: getTsid().toBigInt().toString(),
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
    clubId: string,
    tagIds: string[],
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
          id: getTsid().toBigInt().toString(),
          userId,
          clubId,
          clubCategoryId,
        };
      }),
    );

    await this.clubCategoryLinkRepository.insert(newClubCategoryLinks);

    return newClubCategoryLinks;
  }

  async findAllCategoryByClubId(clubId: string): Promise<ClubCategoryDto[]> {
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
    userId: string,
    clubId: string,
    createClubPostRequestBodyDto: CreateClubPostRequestBodyDto,
  ): Promise<ClubPostDto> {
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

    const { tagNames } = createClubPostRequestBodyDto;

    const postTags = await this.postTagsService.bulkCreate(
      userId,
      tagNames.map((name) => ({ name })),
    );

    const { attachmentPaths } = createClubPostRequestBodyDto;

    const newClubPost = await this.clubPostsService.create(
      new CreateClubPostDto({
        ...createClubPostRequestBodyDto,
        userId,
        clubId,
        tags: postTags,
        attachmentPaths,
      }),
    );

    await this.bulkCreateClubPostTagLinks(
      postTags.map(
        (newClubPostTag) =>
          new CreateClubPostTagLinkDto({
            userId,
            clubPostId: newClubPost.id,
            postTagId: newClubPostTag.id,
          }),
      ),
    );

    return newClubPost;
  }

  async findAllAndCountClubPosts(
    clubId: string,
    findClubPostListRequestQueryDto: FindClubPostListRequestQueryDto,
  ): Promise<[ClubPostsItemDto[], number]> {
    await this.isExistOrNotFound(clubId);

    const [clubPosts, count] = await this.clubPostsService.findAllAndCount(
      new FindClubPostListQueryDto(findClubPostListRequestQueryDto),
    );

    const clubPostComments = await this.clubPostCommentsService.findAll(
      new FindClubPostCommentsDto({
        clubPostId: clubPosts.map((clubPost) => clubPost.id),
      }),
    );

    return [
      clubPosts.map((clubPost) => {
        const filteredComments = clubPostComments.filter(
          (clubPostComment) => clubPost.id === clubPostComment.clubPostId,
        );

        return {
          ...clubPost,
          clubPostComments: [filteredComments[0]],
          commentCount: filteredComments.length,
        };
      }),
      count,
    ];
  }

  @Transactional()
  async patchUpdateClubPost(
    userId: string,
    clubId: string,
    postId: string,
    patchUpdateClubPostDto: PatchUpdateClubPostRequestBodyDto,
  ): Promise<ClubPostDto> {
    await this.isExistOrNotFound(clubId);

    await this.clubPostsService.isExistOrNotFound(clubId, postId);

    if (!isNotEmptyObject(patchUpdateClubPostDto)) {
      throw new HttpBadRequestException({
        code: COMMON_ERROR_CODE.MISSING_UPDATE_FIELD,
      });
    }

    const { tagNames, attachmentPaths, ...postProps } = patchUpdateClubPostDto;

    let postTags: PostTagDto[];

    if (tagNames) {
      await this.clubPostTagLinkRepository.delete({
        clubPostId: postId,
      });

      postTags = await this.postTagsService.bulkCreate(
        userId,
        tagNames.map((tagName) => ({ name: tagName })),
      );

      await this.bulkCreateClubPostTagLinks(
        postTags.map(
          (postTag) =>
            new CreateClubPostTagLinkDto({
              userId,
              clubPostId: postId,
              postTagId: postTag.id,
            }),
        ),
      );
    } else {
      postTags = await this.findPostTags(postId);
    }

    return this.clubPostsService.patchUpdate(
      new PatchUpdateClubPostDto({
        ...postProps,
        clubId,
        postId,
        userId,
        tags: postTags,
        attachmentPaths,
      }),
    );
  }

  @Transactional()
  async removeClubPost(
    userId: string,
    clubId: string,
    postId: string,
  ): Promise<number> {
    await this.isExistOrNotFound(clubId);

    return this.clubPostsService.remove(userId, clubId, postId);
  }

  async createClubPostReaction(
    userId: string,
    clubId: string,
    postId: string,
    createReactionDto: CreateReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(clubId);

    return this.clubPostsService.createReaction(
      userId,
      clubId,
      postId,
      createReactionDto,
    );
  }

  async removeClubPostReaction(
    userId: string,
    clubId: string,
    postId: string,
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(clubId);

    return this.clubPostsService.removeReaction(
      userId,
      clubId,
      postId,
      removeReactionDto,
    );
  }

  @Transactional()
  async createClubPostComment(
    userId: string,
    clubId: string,
    postId: string,
    createClubPostCommentRequestBodyDto: CreateClubPostCommentRequestBodyDto,
  ): Promise<ClubPostCommentDto> {
    await this.isExistOrNotFound(clubId);

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

    return this.clubPostCommentsService.create(
      userId,
      clubId,
      postId,
      createClubPostCommentRequestBodyDto,
    );
  }

  async findAllAndCountClubPostComments(
    clubId: string,
    postId: string,
    findClubPostCommentsListRequestQueryDto: FindClubPostCommentsListRequestQueryDto,
  ): Promise<[ClubPostComment[], number]> {
    await this.isExistOrNotFound(clubId);

    await this.clubPostsService.isExistOrNotFound(clubId, postId);

    return this.clubPostCommentsService.findAllAndCount(
      new FindAndCountClubPostCommentsDto({
        ...findClubPostCommentsListRequestQueryDto,
        clubPostId: postId,
      }),
    );
  }

  @Transactional()
  async patchUpdateClubPostComment(
    userId: string,
    clubId: string,
    postId: string,
    commentId: string,
    patchUpdateClubPostCommentRequestBodyDto: PatchUpdateClubPostCommentRequestBodyDto,
  ): Promise<ClubPostCommentDto> {
    await this.isExistOrNotFound(clubId);

    await this.clubPostsService.isExistOrNotFound(clubId, postId);

    if (!isNotEmptyObject(patchUpdateClubPostCommentRequestBodyDto)) {
      throw new HttpBadRequestException({
        code: COMMON_ERROR_CODE.MISSING_UPDATE_FIELD,
      });
    }

    return this.clubPostCommentsService.patchUpdate(
      new PatchUpdateClubPostCommentDto({
        ...patchUpdateClubPostCommentRequestBodyDto,
        id: commentId,
        userId,
        clubPostId: postId,
      }),
    );
  }

  @Transactional()
  async removeClubPostComment(
    userId: string,
    clubId: string,
    postId: string,
    commentId: string,
  ): Promise<number> {
    await this.isExistOrNotFound(clubId);

    await this.clubPostsService.isExistOrNotFound(clubId, postId);

    return this.clubPostCommentsService.remove(
      new RemoveClubPostCommentDto({
        id: commentId,
        userId,
        clubPostId: postId,
      }),
    );
  }

  async findLatestApplicationForm(
    clubId: string,
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
        return a.clubPostId === b.clubPostId && a.postTagId === b.postTagId;
      },
    ).map((createClubPostTagLinkDto: CreateClubPostTagLinkDto) => {
      const { userId, clubPostId, postTagId } = createClubPostTagLinkDto;

      return this.clubPostTagLinkRepository.create({
        id: getTsid().toBigInt().toString(),
        userId,
        clubPostId,
        postTagId,
      });
    });

    await this.clubPostTagLinkRepository.insert(newClubPostTagLinks);

    return newClubPostTagLinks;
  }

  async putUpdateClubApplicationForm(
    userId: string,
    clubId: string,
    formId: string,
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

  @Transactional()
  async createClubReview(
    userId: string,
    clubId: string,
    createClubReviewRequestBodyDto: CreateClubReviewRequestBodyDto,
  ): Promise<ClubReviewDto> {
    const isExistClub = await this.clubRepository.exist({
      where: { id: clubId, status: ClubStatus.Active },
    });

    if (!isExistClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }
    /**
     * @todo 동아리 지원서 승인 이력을 조회하는 로직 추가
     */
    return this.clubReviewsService.create(
      new CreateClubReviewDto({
        userId,
        clubId,
        ...createClubReviewRequestBodyDto,
      }),
    );
  }

  async findAllAndCountClubReview(
    clubId: string,
    findClubReviewListRequestQueryDto: FindClubReviewListRequestQueryDto,
  ): Promise<[Omit<ClubReviewsItemDto, 'status' | 'deletedAt'>[], number]> {
    await this.isExistOrNotFound(clubId);

    return this.clubReviewsService.findAllAndCount(
      new FindClubReviewListQueryDto({
        ...findClubReviewListRequestQueryDto,
      }),
    );
  }

  async findBestClubReview(clubId: string): Promise<ClubReviewDto> {
    await this.isExistOrNotFound(clubId);

    return this.clubReviewsService.findBest(clubId);
  }

  async patchUpdateClubReview(
    userId: string,
    clubId: string,
    reviewId: string,
    patchUpdateClubReviewRequestDto: PatchUpdateClubReviewRequestDto,
  ): Promise<ClubReviewDto> {
    const isExistClub = await this.clubRepository.exist({
      where: { id: clubId, status: ClubStatus.Active },
    });

    if (!isExistClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return this.clubReviewsService.patchUpdate(
      new PatchUpdateClubReviewDto({
        id: reviewId,
        clubId,
        userId,
        ...patchUpdateClubReviewRequestDto,
      }),
    );
  }

  async removeClubReview(
    userId: string,
    clubId: string,
    reviewId: string,
  ): Promise<number> {
    const isExistClub = await this.clubRepository.exist({
      where: { id: clubId, status: ClubStatus.Active },
    });

    if (!isExistClub) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return this.clubReviewsService.remove(
      new RemoveClubReviewDto({
        id: reviewId,
        userId,
        clubId,
      }),
    );
  }

  async getClubReviewsScore(clubId: string): Promise<ScoreDto> {
    await this.isExistOrNotFound(clubId);

    return this.clubReviewsService.getScore(clubId);
  }

  async createClubReviewReaction(
    userId: string,
    clubId: string,
    reviewId: string,
    createReactionDto: CreateReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(clubId);

    return this.clubReviewsService.createReaction(
      reviewId,
      userId,
      clubId,
      createReactionDto,
    );
  }

  async removeClubReviewReaction(
    userId: string,
    clubId: string,
    reviewId: string,
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(clubId);

    return this.clubReviewsService.removeReaction(
      clubId,
      reviewId,
      userId,
      removeReactionDto,
    );
  }

  @Transactional()
  async createClubApplication(
    userId: string,
    clubId: string,
    createClubApplicationRequestBodyDto: CreateClubApplicationRequestBodyDto,
  ): Promise<ClubApplicationDto> {
    await this.isExistOrNotFound(clubId);

    return this.clubApplicationsService.create(
      new CreateClubApplicationDto({
        clubId,
        userId,
        answers: createClubApplicationRequestBodyDto.answers,
        status: createClubApplicationRequestBodyDto.status,
      }),
    );
  }

  @Transactional()
  async findAllAndCountClubApplications(
    clubId: string,
    findClubApplicationListRequestQueryDto: FindClubApplicationListRequestQueryDto,
  ): Promise<[ClubApplicationsItemDto[], number]> {
    await this.isExistOrNotFound(clubId);

    return this.clubApplicationsService.findAllAndCount(
      new FindClubApplicationListQueryDto({
        clubId,
        page: findClubApplicationListRequestQueryDto.page,
        pageSize: findClubApplicationListRequestQueryDto.pageSize,
        status: findClubApplicationListRequestQueryDto.status,
        order: findClubApplicationListRequestQueryDto.order,
      }),
    );
  }

  @Transactional()
  async findOneClubApplication(
    clubId: string,
    applicationId: string,
  ): Promise<ClubApplicationDto> {
    await this.isExistOrNotFound(clubId);

    return this.clubApplicationsService.updateStatus(
      applicationId,
      ClubApplicationStatus.Viewed,
    );
  }

  @Transactional()
  async patchUpdateClubApplication(
    userId: string,
    clubId: string,
    applicationId: string,
    patchUpdateClubApplicationDto: PatchUpdateClubApplicationDto,
  ): Promise<ClubApplicationDto> {
    await this.isExistOrNotFound(clubId);

    return this.clubApplicationsService.patchUpdate(
      userId,
      applicationId,
      patchUpdateClubApplicationDto,
    );
  }

  @Transactional()
  async updateClubApplicationStatus(
    userId: string,
    clubId: string,
    applicationId: string,
    updateClubApplicationStatusDto: UpdateClubApplicationStatusDto,
  ): Promise<ClubApplicationDto> {
    await this.isExistOrNotFound(clubId);

    const clubMember = await this.clubMembersService.findOneByUserId(
      clubId,
      userId,
    );

    if (!clubMember?.roles?.includes(ClubMemberRole.President)) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const newClubApplication = await this.clubApplicationsService.updateStatus(
      applicationId,
      updateClubApplicationStatusDto.status,
    );

    await this.clubMembersService.create(clubId, newClubApplication.userId, [
      ClubMemberRole.Member,
    ]);

    return newClubApplication;
  }

  async isExistOrNotFound(clubId: string): Promise<true> {
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

    return isExistClub;
  }

  private async syncTagLinkFromMapping(clubId: string): Promise<ClubTagDto[]> {
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

  private async findPostTags(clubPostId: string): Promise<PostTagDto[]> {
    const postTagLinks = await this.clubPostTagLinkRepository.find({
      where: {
        clubPostId,
      },
      relations: {
        postTag: true,
      },
    });

    return postTagLinks.map(
      (postTagLink) => new PostTagDto(postTagLink.postTag),
    );
  }
}
