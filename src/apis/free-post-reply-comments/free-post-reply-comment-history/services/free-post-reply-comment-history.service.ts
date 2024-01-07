import { Injectable } from '@nestjs/common';
import { FreePostCommentHistoryService } from '@src/apis/free-post-comments/free-post-comment-history/services/free-post-comment-history.service';
import { FreePostReplyCommentHistoryRepository } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/repositories/free-post-reply-comment-history.repository';
import { HistoryAction, SortOrder } from '@src/constants/enum';
import { EntityManager } from 'typeorm';
import { CreateFreePostReplyCommentHistoryDto } from '../dto/create-free-post-reply-comment-history.dto';

@Injectable()
export class FreePostReplyCommentHistoryService {
  constructor(
    private readonly freePostCommentHistoryService: FreePostCommentHistoryService,
    private readonly freePostReplyCommentHistoryRepository: FreePostReplyCommentHistoryRepository,
  ) {}

  async create(
    entityManager: EntityManager,
    userId: number,
    freePostId: number,
    action: HistoryAction,
    createFreePostReplyCommentHistoryDto: CreateFreePostReplyCommentHistoryDto,
  ) {
    const recentFreePostHistory =
      await this.freePostCommentHistoryService.findOneOrFail(entityManager, {
        select: {
          id: true,
        },
        where: {
          freePostHistory: {
            freePost: {
              id: freePostId,
            },
          },
        },
        order: {
          id: SortOrder.Desc,
        },
      });

    return entityManager
      .withRepository(this.freePostReplyCommentHistoryRepository)
      .save({
        userId,
        action,
        freePostCommentHistoryId: recentFreePostHistory.id,
        ...new CreateFreePostReplyCommentHistoryDto(
          createFreePostReplyCommentHistoryDto,
        ),
      });
  }
}
