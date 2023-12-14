import { Injectable } from '@nestjs/common';
import { CreateFreePostCommentHistoryDto } from '@src/apis/free-posts/free-post-history/dto/create-free-post-comment-history.dto';
import { CreateFreePostHistoryDto } from '@src/apis/free-posts/free-post-history/dto/create-free-post-history.dto';
import { CreateFreePostReplyCommentHistoryDto } from '@src/apis/free-posts/free-post-history/dto/create-free-post-reply-comment-history.dto';
import { FreePostCommentHistoryRepository } from '@src/apis/free-posts/free-post-history/repositories/free-post-comment-history.repository';
import { FreePostHistoryRepository } from '@src/apis/free-posts/free-post-history/repositories/free-post-history.repository';
import { FreePostReplyCommentHistoryRepository } from '@src/apis/free-posts/free-post-history/repositories/free-post-reply-comment-history.repository';
import { HistoryAction, SortOrder } from '@src/constants/enum';
import { EntityManager } from 'typeorm';

@Injectable()
export class FreePostHistoryService {
  constructor(
    private readonly freePostHistoryRepository: FreePostHistoryRepository,
    private readonly freePostCommentHistoryRepository: FreePostCommentHistoryRepository,
    private readonly freePostReplyCommentHistoryRepository: FreePostReplyCommentHistoryRepository,
  ) {}

  create(
    entityManager: EntityManager,
    userId: number,
    freePostId: number,
    action: HistoryAction,
    createFreePostHistoryDto: CreateFreePostHistoryDto,
  ) {
    return entityManager.withRepository(this.freePostHistoryRepository).save({
      userId,
      freePostId,
      action,
      ...new CreateFreePostHistoryDto(createFreePostHistoryDto),
    });
  }

  async createComment(
    entityManager: EntityManager,
    userId: number,
    freePostId: number,
    action: HistoryAction,
    createFreePostCommentHistoryDto: CreateFreePostCommentHistoryDto,
  ) {
    const recentFreePostHistory = await entityManager
      .withRepository(this.freePostHistoryRepository)
      .findOneOrFail({
        select: {
          id: true,
        },
        where: {
          freePostId,
        },
        order: {
          id: SortOrder.Desc,
        },
      });

    return entityManager
      .withRepository(this.freePostCommentHistoryRepository)
      .save({
        userId,
        action,
        freePostHistoryId: recentFreePostHistory.id,
        ...new CreateFreePostCommentHistoryDto(createFreePostCommentHistoryDto),
      });
  }

  /**
   * @todo
   */
  async createReplyComment(
    entityManager: EntityManager,
    userId: number,
    freePostId: number,
    action: HistoryAction,
    createFreePostReplyCommentHistoryDto: CreateFreePostReplyCommentHistoryDto,
  ) {
    const recentFreePostHistory = await entityManager
      .withRepository(this.freePostHistoryRepository)
      .findOneOrFail({
        select: {
          id: true,
        },
        where: {
          freePostId,
        },
        order: {
          id: SortOrder.Desc,
        },
      });

    const recentFreePostCommentHistory = await entityManager
      .withRepository(this.freePostCommentHistoryRepository)
      .findOneOrFail({
        select: {
          id: true,
        },
        where: {
          freePostHistoryId: recentFreePostHistory.id,
        },
      });

    return entityManager
      .withRepository(this.freePostReplyCommentHistoryRepository)
      .save({
        userId,
        action,
        freePostCommentHistoryId: recentFreePostCommentHistory.id,
        ...new CreateFreePostReplyCommentHistoryDto(
          createFreePostReplyCommentHistoryDto,
        ),
      });
  }
}
