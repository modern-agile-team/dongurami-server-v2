import { Injectable } from '@nestjs/common';

import { differenceWith } from 'lodash';
import { Transactional } from 'typeorm-transactional';

import { CommonPostsService } from '@src/apis/common-posts/services/common-posts.service';
import { NoticePostStatus } from '@src/apis/notice-posts/constants/notice-post.enum';
import { CreateNoticePostDto } from '@src/apis/notice-posts/dto/create-notice-post.dto';
import { FindNoticePostListQueryDto } from '@src/apis/notice-posts/dto/find-notice-post-list-query.dto';
import { FindNoticePostReactionListQueryDto } from '@src/apis/notice-posts/dto/find-notice-post-reactions-list-query.dto';
import { NoticePostDto } from '@src/apis/notice-posts/dto/notice-post.dto';
import { NoticePostsItemDto } from '@src/apis/notice-posts/dto/notice-posts-item.dto';
import { PatchUpdateNoticePostDto } from '@src/apis/notice-posts/dto/patch-update-notice-post.dto';
import { PutUpdateNoticePostDto } from '@src/apis/notice-posts/dto/put-update-notice-post.dto';
import { NoticePostTagLinkRepository } from '@src/apis/notice-posts/repositories/notice-post-tag-links.repository';
import { NoticePostRepository } from '@src/apis/notice-posts/repositories/notice-post.repository';
import { PostTagDto } from '@src/apis/post-tags/dto/post-tag.dto';
import { PostTagsService } from '@src/apis/post-tags/services/post-tags.service';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { UsersService } from '@src/apis/users/services/users.service';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { NoticePost } from '@src/entities/NoticePost';
import { NoticePostReaction } from '@src/entities/NoticePostReaction';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class NoticePostsService {
  private readonly LIKE_SEARCH_FIELD: readonly (keyof Pick<
    NoticePostDto,
    'title'
  >)[] = ['title'];

  constructor(
    private readonly reactionsService: ReactionsService<NoticePostReaction>,
    private readonly commonPostsService: CommonPostsService<NoticePost>,
    private readonly postTagsService: PostTagsService,
    private readonly usersService: UsersService,

    private readonly noticePostRepository: NoticePostRepository,
    private readonly noticePostTagLinkRepository: NoticePostTagLinkRepository,

    private readonly queryHelper: QueryHelper,
  ) {}

  @Transactional()
  async create(userId: number, createNoticePostDto: CreateNoticePostDto) {
    const { tagNames, ...postProps } = createNoticePostDto;

    const postTags = await this.postTagsService.bulkCreate(
      userId,
      tagNames.map((tagName) => ({
        name: tagName,
      })),
    );

    const newPost = await this.noticePostRepository.save({
      userId,
      ...postProps,
      tags: postTags,
    });

    const postingUser = await this.usersService.findOneById(userId);

    await this.bulkAppendTagLink(userId, newPost.id, postTags);

    return new NoticePostDto({ ...newPost, postTags, user: postingUser });
  }

  async findAllAndCount(
    findNoticePostListQueryDto: FindNoticePostListQueryDto,
  ): Promise<[NoticePostsItemDto[], number]> {
    const { page, pageSize, order, ...filter } = findNoticePostListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );

    return this.noticePostRepository.findAndCount({
      select: {
        id: true,
        userId: true,
        title: true,
        hit: true,
        isAllowComment: true,
        createdAt: true,
        updatedAt: true,
      },
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
      relations: {
        user: true,
      },
    });
  }

  async findOneOrNotFound(noticePostId: number): Promise<NoticePostDto> {
    const noticePost = await this.noticePostRepository.findOne({
      where: {
        id: noticePostId,
        status: NoticePostStatus.Posting,
      },
      relations: {
        user: true,
      },
    });

    if (!noticePost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    const postTags = await this.findPostTags(noticePostId);

    return new NoticePostDto({ ...noticePost, postTags });
  }

  async findOne(noticePostId: number): Promise<NoticePostDto | void> {
    const noticePost = await this.noticePostRepository.findOneBy({
      id: noticePostId,
      status: NoticePostStatus.Posting,
    });

    if (!noticePost) {
      return;
    }

    return new NoticePostDto(noticePost);
  }

  @Transactional()
  async putUpdate(
    noticePostId: number,
    userId: number,
    putUpdateNoticePostDto: PutUpdateNoticePostDto,
  ): Promise<NoticePostDto> {
    const { tagNames, ...postProps } = putUpdateNoticePostDto;

    const oldNoticePost = await this.findOneOrNotFound(noticePostId);

    if (oldNoticePost.userId !== userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const postTags = await this.postTagsService.bulkCreate(
      userId,
      tagNames.map((tagName) => ({ name: tagName })),
    );

    const newNoticePost = this.noticePostRepository.create({
      ...oldNoticePost,
      ...postProps,
      tags: postTags,
    });

    await this.noticePostRepository.update(
      {
        id: noticePostId,
      },
      {
        ...newNoticePost,
      },
    );

    await this.noticePostTagLinkRepository.delete({
      noticePostId,
    });

    await this.bulkAppendTagLink(userId, newNoticePost.id, postTags);

    return new NoticePostDto({ ...newNoticePost, postTags });
  }

  @Transactional()
  async patchUpdate(
    noticePostId: number,
    userId: number,
    patchUpdateNoticePostDto: PatchUpdateNoticePostDto,
  ): Promise<NoticePostDto> {
    const { tagNames, ...postProps } = patchUpdateNoticePostDto;

    if (!Object.values(patchUpdateNoticePostDto).length) {
      throw new HttpBadRequestException({
        code: COMMON_ERROR_CODE.MISSING_UPDATE_FIELD,
      });
    }

    const oldNoticePost = await this.findOneOrNotFound(noticePostId);

    if (oldNoticePost.userId !== userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    let postTags: PostTagDto[];

    if (tagNames) {
      await this.noticePostTagLinkRepository.delete({
        noticePostId,
      });

      postTags = await this.postTagsService.bulkCreate(
        userId,
        tagNames.map((tagName) => ({ name: tagName })),
      );

      await this.bulkAppendTagLink(userId, noticePostId, postTags);
    } else {
      postTags = await this.findPostTags(noticePostId);
    }

    const newNoticePost = this.noticePostRepository.create({
      ...oldNoticePost,
      ...postProps,
      tags: postTags,
    });

    await this.noticePostRepository.update(
      { id: noticePostId, status: NoticePostStatus.Posting },
      {
        ...newNoticePost,
      },
    );

    return new NoticePostDto({ ...newNoticePost, postTags });
  }

  @Transactional()
  async remove(userId: number, noticePostId: number): Promise<number> {
    const existPost = await this.findOne(noticePostId);

    if (!existPost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    if (existPost.userId !== userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const updateResult = await this.noticePostRepository.update(
      { id: noticePostId },
      {
        ...existPost,
        deletedAt: new Date(),
        status: NoticePostStatus.Remove,
      },
    );

    return updateResult.affected;
  }

  async increaseHit(noticePostId: number): Promise<void> {
    return this.commonPostsService.incrementHit(noticePostId);
  }

  async bulkAppendTagLink(
    userId: number,
    postId: number,
    postTags: PostTagDto[],
  ) {
    const existTagLinks = await this.noticePostTagLinkRepository.findBy({
      noticePostId: postId,
    });

    const newAppendTags = differenceWith(
      postTags,
      existTagLinks,
      (postTag, postTagLink) => postTag.id === postTagLink.postTagId,
    ).map((postTag) =>
      this.noticePostTagLinkRepository.create({
        userId,
        noticePostId: postId,
        postTagId: postTag.id,
      }),
    );

    await this.noticePostTagLinkRepository.insert(newAppendTags);

    return newAppendTags;
  }

  private async findPostTags(noticePostId: number): Promise<PostTagDto[]> {
    const postTagLinks = await this.noticePostTagLinkRepository.find({
      where: {
        noticePostId,
      },
      relations: {
        postTag: true,
      },
    });

    return postTagLinks.map(
      (postTagLink) => new PostTagDto(postTagLink.postTag),
    );
  }

  async findAllAndCountReactions(
    noticePostId: number,
    findNoticePostReactionListQueryDto: FindNoticePostReactionListQueryDto,
  ): Promise<[NoticePostReaction[], number]> {
    const { page, pageSize, order, type, ...filter } =
      findNoticePostReactionListQueryDto;

    const existNoticePost = await this.noticePostRepository.exist({
      where: {
        id: noticePostId,
      },
    });

    if (!existNoticePost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    const where = this.queryHelper.buildWherePropForFind(filter);

    return this.reactionsService.findAllAndCount({
      where: { ...where, parentId: noticePostId, reactionType: { name: type } },
      skip: page * pageSize,
      take: pageSize,
      order,
      relations: {
        reactionType: true,
      },
    });
  }

  async createReaction(
    userId: number,
    noticePostId: number,
    createReactionDto: CreateReactionDto,
  ): Promise<void> {
    const isExistPost = await this.noticePostRepository.exist({
      where: {
        id: noticePostId,
      },
    });

    if (!isExistPost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return this.reactionsService.create(
      createReactionDto.type,
      userId,
      noticePostId,
    );
  }

  async removeReaction(
    userId: number,
    noticePostId: number,
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    const isExistPost = await this.noticePostRepository.exist({
      where: {
        id: noticePostId,
      },
    });

    if (!isExistPost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return this.reactionsService.remove(
      removeReactionDto.type,
      userId,
      noticePostId,
    );
  }
}
