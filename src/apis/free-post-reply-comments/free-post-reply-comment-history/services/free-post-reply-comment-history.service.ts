import { Injectable } from '@nestjs/common';
import { FreePostReplyCommentHistoryRepository } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/repositories/free-post-reply-comment-history.repository';
import { HistoryAction } from '@src/constants/enum';
import { EntityManager } from 'typeorm';
import { CreateFreePostReplyCommentHistoryDto } from '../dto/create-free-post-reply-comment-history.dto';

@Injectable()
export class FreePostReplyCommentHistoryService {
  constructor(
    private readonly freePostReplyCommentHistoryRepository: FreePostReplyCommentHistoryRepository,
  ) {}

  async create(
    entityManager: EntityManager,
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    freePostReplyCommentId: number,
    action: HistoryAction,
    createFreePostReplyCommentHistoryDto: CreateFreePostReplyCommentHistoryDto,
  ) {
    return entityManager
      .withRepository(this.freePostReplyCommentHistoryRepository)
      .save({
        userId,
        action,
        freePostId,
        freePostCommentId,
        freePostReplyCommentId,
        ...new CreateFreePostReplyCommentHistoryDto(
          createFreePostReplyCommentHistoryDto,
        ),
      });
  }
}
