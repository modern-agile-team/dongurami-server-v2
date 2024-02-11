import { Injectable } from '@nestjs/common';
import { FreePostCommentsService } from '@src/apis/free-post-comments/services/free-post-comments.service';
import { FreePostReplyCommentStatus } from '@src/apis/free-post-reply-comments/constants/free-post-reply-comment.enum';
import { CreateFreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/create-free-post-reply-comment.dto';
import { FindFreePostReplyCommentListQueryDto } from '@src/apis/free-post-reply-comments/dto/find-free-post-reply-comment-list-query.dto';
import { FreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/free-post-reply-comment.dto';
import { FreePostReplyCommentsItemDto } from '@src/apis/free-post-reply-comments/dto/free-post-reply-comments-item.dto';
import { PutUpdateFreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/put-update-free-post-reply-comment.dto';
import { FreePostReplyCommentHistoryService } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/services/free-post-reply-comment-history.service';
import { FreePostReplyCommentRepository } from '@src/apis/free-posts/repositories/free-post-reply-comment.repository';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { HistoryAction } from '@src/constants/enum';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { FreePostReplyComment } from '@src/entities/FreePostReplyComment';
import { FreePostReplyCommentReaction } from '@src/entities/FreePostReplyCommentReaction';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class FreePostReplyCommentsService {
  constructor(
    private readonly freePostCommentsService: FreePostCommentsService,
    private readonly freePostReplyCommentHistoryService: FreePostReplyCommentHistoryService,
    private readonly reactionsService: ReactionsService<FreePostReplyCommentReaction>,

    private readonly queryHelper: QueryHelper,

    private readonly freePostReplyCommentRepository: FreePostReplyCommentRepository,
  ) {}

  @Transactional()
  async create(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    createFreePostReplyCommentDto: CreateFreePostReplyCommentDto,
  ): Promise<FreePostReplyCommentDto> {
    const existComment = await this.freePostCommentsService.findOneOrNotFound(
      freePostId,
      freePostCommentId,
    );

    const newPostReplyComment = await this.freePostReplyCommentRepository.save({
      userId,
      freePostId,
      freePostCommentId: existComment.id,
      ...createFreePostReplyCommentDto,
    });

    await this.freePostReplyCommentHistoryService.create(
      userId,
      freePostId,
      freePostCommentId,
      newPostReplyComment.id,
      HistoryAction.Insert,
      newPostReplyComment,
    );

    return new FreePostReplyCommentDto(newPostReplyComment);
  }

  async findAllAndCount(
    freePostId: number,
    freePostCommentId: number,
    findFreePostReplyCommentListQueryDto: FindFreePostReplyCommentListQueryDto,
  ): Promise<[FreePostReplyCommentsItemDto[], number]> {
    const existComment = await this.freePostCommentsService.findOneOrNotFound(
      freePostId,
      freePostCommentId,
    );

    const { page, pageSize, order, ...filter } =
      findFreePostReplyCommentListQueryDto;

    const where = this.queryHelper.buildWherePropForFind<FreePostReplyComment>({
      ...filter,
      freePostCommentId: existComment.id,
    });

    return this.freePostReplyCommentRepository.findAndCount({
      where,
      order,
      skip: page * pageSize,
      take: pageSize,
    });
  }

  async findOneOrNotFound(
    freePostId: number,
    freePostCommentId: number,
    freePostReplyCommentId: number,
  ): Promise<FreePostReplyCommentDto> {
    await this.freePostCommentsService.findOneOrNotFound(
      freePostId,
      freePostCommentId,
    );

    const existReplyComment = await this.freePostReplyCommentRepository.findOne(
      {
        where: {
          freePostCommentId,
          id: freePostReplyCommentId,
          status: FreePostReplyCommentStatus.Posting,
        },
      },
    );

    if (!existReplyComment) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new FreePostReplyCommentDto(existReplyComment);
  }

  @Transactional()
  async putUpdate(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    freePostReplyCommentId: number,
    putUpdateFreePostReplyCommentDto: PutUpdateFreePostReplyCommentDto,
  ): Promise<FreePostReplyCommentDto> {
    const oldReplyComment = await this.findOneOrNotFound(
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
    );

    if (userId !== oldReplyComment.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    await this.freePostReplyCommentRepository.update(
      {
        id: freePostCommentId,
      },
      {
        ...putUpdateFreePostReplyCommentDto,
      },
    );

    const newReplyComment = this.freePostReplyCommentRepository.create({
      ...oldReplyComment,
      ...putUpdateFreePostReplyCommentDto,
    });

    await this.freePostReplyCommentHistoryService.create(
      userId,
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
      HistoryAction.Update,
      newReplyComment,
    );

    return new FreePostReplyCommentDto(newReplyComment);
  }

  @Transactional()
  async remove(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    freePostReplyCommentId: number,
  ): Promise<number> {
    const existReplyComment = await this.findOneOrNotFound(
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
    );

    if (userId !== existReplyComment.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const freePostUpdateResult =
      await this.freePostReplyCommentRepository.update(
        {
          id: freePostReplyCommentId,
        },
        {
          status: FreePostReplyCommentStatus.Remove,
          deletedAt: new Date(),
        },
      );

    await this.freePostReplyCommentHistoryService.create(
      userId,
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
      HistoryAction.Delete,
      {
        ...existReplyComment,
        status: FreePostReplyCommentStatus.Remove,
      },
    );

    return freePostUpdateResult.affected;
  }

  async createReaction(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    freePostReplyCommentId: number,
    createReactionDto: CreateReactionDto,
  ): Promise<void> {
    const existReplyComment = await this.findOneOrNotFound(
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
    );

    return this.reactionsService.create(
      createReactionDto.type,
      userId,
      existReplyComment.id,
    );
  }

  async removeReaction(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    freePostReplyCommentId: number,
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    const existReplyComment = await this.findOneOrNotFound(
      freePostId,
      freePostCommentId,
      freePostReplyCommentId,
    );

    return this.reactionsService.remove(
      removeReactionDto.type,
      userId,
      existReplyComment.id,
    );
  }
}
