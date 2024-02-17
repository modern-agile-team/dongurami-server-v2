import { Injectable } from '@nestjs/common';

import { Transactional } from 'typeorm-transactional';

import { CommonPostsService } from '@src/apis/common-posts/services/common-posts.service';
import { NoticePostStatus } from '@src/apis/notice-posts/constants/notice-post.enum';
import { CreateNoticePostDto } from '@src/apis/notice-posts/dto/create-notice-post.dto';
import { FindNoticePostListQueryDto } from '@src/apis/notice-posts/dto/find-notice-post-list-query.dto';
import { NoticePostDto } from '@src/apis/notice-posts/dto/notice-post.dto';
import { NoticePostsItemDto } from '@src/apis/notice-posts/dto/notice-posts-item.dto';
import { PatchUpdateNoticePostDto } from '@src/apis/notice-posts/dto/patch-update-notice-post.dto';
import { PutUpdateNoticePostDto } from '@src/apis/notice-posts/dto/put-update-notice-post.dto';
import { NoticePostRepository } from '@src/apis/notice-posts/repositories/notice-post.repository';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { NoticePost } from '@src/entities/NoticePost';
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
    private readonly queryHelper: QueryHelper,
    private readonly noticePostRepository: NoticePostRepository,
    private readonly commonPostsService: CommonPostsService<NoticePost>,
  ) {}

  @Transactional()
  async create(userId: number, createNoticePostDto: CreateNoticePostDto) {
    const newPost = await this.noticePostRepository.save({
      userId,
      ...createNoticePostDto,
    });

    return new NoticePostDto(newPost);
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
    });
  }

  async findOneOrNotFound(noticePostId: number): Promise<NoticePostDto> {
    const noticePost = await this.noticePostRepository.findOneBy({
      id: noticePostId,
      status: NoticePostStatus.Posting,
    });

    if (!noticePost) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new NoticePostDto(noticePost);
  }

  @Transactional()
  async putUpdate(
    noticePostId: number,
    userId: number,
    putUpdateNoticePostDto: PutUpdateNoticePostDto,
  ): Promise<NoticePostDto> {
    const oldNoticePost = await this.findOneOrNotFound(noticePostId);

    if (oldNoticePost.userId !== userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const newNoticePost = this.noticePostRepository.create({
      ...oldNoticePost,
      ...putUpdateNoticePostDto,
    });

    await this.noticePostRepository.update(
      {
        id: noticePostId,
      },
      {
        ...newNoticePost,
      },
    );

    return new NoticePostDto(newNoticePost);
  }

  @Transactional()
  async patchUpdate(
    noticePostId: number,
    userId: number,
    patchUpdateNoticePostDto: PatchUpdateNoticePostDto,
  ): Promise<NoticePostDto> {
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

    const newNoticePost = this.noticePostRepository.create({
      ...oldNoticePost,
      ...patchUpdateNoticePostDto,
    });

    await this.noticePostRepository.update(
      { id: noticePostId, status: NoticePostStatus.Posting },
      {
        ...newNoticePost,
      },
    );

    return new NoticePostDto(newNoticePost);
  }

  @Transactional()
  async remove(userId: number, noticePostId: number): Promise<number> {
    const existPost = await this.findOneOrNotFound(noticePostId);

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
}
