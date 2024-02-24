import { Injectable } from '@nestjs/common';

import { IsNull } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { NoticePostCommentStatus } from '@src/apis/notice-post-comments/constants/notice-post-comment.enum';
import { CreateNoticePostCommentDto } from '@src/apis/notice-post-comments/dto/create-notice-post-comment.dto';
import { FindNoticePostCommentListQueryDto } from '@src/apis/notice-post-comments/dto/find-notice-post-comment-list-query.dto';
import { NoticePostCommentDto } from '@src/apis/notice-post-comments/dto/notice-post-comment.dto';
import { NoticePostCommentsItemDto } from '@src/apis/notice-post-comments/dto/notice-post-comments-item.dto';
import { PutUpdateNoticePostCommentDto } from '@src/apis/notice-post-comments/dto/put-update-notice-post-comment.dto';
import { NoticePostCommentRepository } from '@src/apis/notice-post-comments/repositories/notice-post-comment.repository';
import { NoticePostsService } from '@src/apis/notice-posts/services/notice-posts.service';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { NoticePostComment } from '@src/entities/NoticePostComment';
import { NoticePostCommentReaction } from '@src/entities/NoticePostCommentReaction';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class NoticePostCommentsService {
  constructor(
    private readonly noticePostsService: NoticePostsService,
    private readonly reactionsService: ReactionsService<NoticePostCommentReaction>,

    private readonly queryHelper: QueryHelper,

    private readonly noticePostCommentRepository: NoticePostCommentRepository,
  ) {}

  @Transactional()
  async create(
    userId: number,
    noticePostId: number,
    createNoticePostCommentDto: CreateNoticePostCommentDto,
  ): Promise<NoticePostCommentDto> {
    const existPost =
      await this.noticePostsService.findOneOrNotFound(noticePostId);

    if (createNoticePostCommentDto.parentId !== undefined) {
      const parentComment = await this.findOneOrNotFound(
        noticePostId,
        createNoticePostCommentDto.parentId,
        null,
      );

      createNoticePostCommentDto.depth = parentComment.depth + 1;
    }

    if (createNoticePostCommentDto.depth > 1) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '공지게시글 댓글 생성 중 depth가 2 이상인 경우가 생김',
      });
    }

    const newPostComment = await this.noticePostCommentRepository.save({
      userId,
      status: NoticePostCommentStatus.Posting,
      noticePostId: existPost.id,
      ...createNoticePostCommentDto,
    });

    return new NoticePostCommentDto(newPostComment);
  }

  async findAllAndCount(
    noticePostId: number,
    findNoticePostCommentListQueryDto: FindNoticePostCommentListQueryDto,
  ): Promise<[NoticePostCommentsItemDto[], number]> {
    const existPost =
      await this.noticePostsService.findOneOrNotFound(noticePostId);

    const { page, pageSize, order, loadDepth, ...filter } =
      findNoticePostCommentListQueryDto;

    const where = this.queryHelper.buildWherePropForFind<NoticePostComment>({
      ...filter,
      noticePostId: existPost.id,
    });

    const relations = this.queryHelper.createNestedChildRelations(loadDepth);

    /**
     * @todo 1 이상 depth도 처리되게 변경
     * @todo join 후 where 필터링이 아닌 join on 조건으로 필터링되게
     */
    return this.noticePostCommentRepository.findAndCount({
      where: {
        ...where,
        depth: 0,
        children: {
          status: NoticePostCommentStatus.Posting,
        },
      },
      order,
      skip: page * pageSize,
      take: pageSize,
      relations,
    });
  }

  async findOneOrNotFound(
    noticePostId: number,
    noticePostCommentId: number,
    parentId?: number | null,
  ): Promise<NoticePostCommentDto> {
    const existComment = await this.noticePostCommentRepository.findOne({
      where: {
        id: noticePostCommentId,
        noticePostId,
        parentId: parentId === null ? IsNull() : parentId,
        status: NoticePostCommentStatus.Posting,
      },
    });

    if (!existComment) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new NoticePostCommentDto(existComment);
  }

  @Transactional()
  async putUpdate(
    userId: number,
    noticePostId: number,
    noticePostCommentId: number,
    putUpdateNoticePostCommentDto: PutUpdateNoticePostCommentDto,
  ): Promise<NoticePostCommentDto> {
    const oldComment = await this.findOneOrNotFound(
      noticePostId,
      noticePostCommentId,
      putUpdateNoticePostCommentDto.parentId === undefined
        ? null
        : putUpdateNoticePostCommentDto.parentId,
    );

    if (userId !== oldComment.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const newComment = this.noticePostCommentRepository.create({
      ...oldComment,
      ...putUpdateNoticePostCommentDto,
    });

    await this.noticePostCommentRepository.update(
      {
        id: noticePostCommentId,
      },
      {
        ...newComment,
      },
    );

    return new NoticePostCommentDto(newComment);
  }

  @Transactional()
  async remove(
    userId: number,
    noticePostId: number,
    noticePostCommentId: number,
  ): Promise<number> {
    const existComment = await this.findOneOrNotFound(
      noticePostId,
      noticePostCommentId,
    );

    if (userId !== existComment.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const noticePostCommentUpdateResult =
      await this.noticePostCommentRepository.update(
        {
          id: noticePostCommentId,
        },
        {
          ...existComment,
          status: NoticePostCommentStatus.Remove,
          deletedAt: new Date(),
        },
      );

    return noticePostCommentUpdateResult.affected;
  }

  async createReaction(
    userId: number,
    noticePostId: number,
    noticePostCommentId: number,
    createReactionDto: CreateReactionDto,
  ): Promise<void> {
    const existComment = await this.findOneOrNotFound(
      noticePostId,
      noticePostCommentId,
    );

    return this.reactionsService.create(
      createReactionDto.type,
      userId,
      existComment.id,
    );
  }

  async removeReaction(
    userId: number,
    noticePostId: number,
    noticePostCommentId: number,
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    const existComment = await this.findOneOrNotFound(
      noticePostId,
      noticePostCommentId,
    );

    return this.reactionsService.remove(
      removeReactionDto.type,
      userId,
      existComment.id,
    );
  }
}
