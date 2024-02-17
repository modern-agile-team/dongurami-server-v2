import { Injectable } from '@nestjs/common';

import { CreateFreePostReplyCommentHistoryDto } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/dto/create-free-post-reply-comment-history.dto';
import { FreePostReplyCommentHistoryRepository } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/repositories/free-post-reply-comment-history.repository';
import { HistoryAction } from '@src/constants/enum';

@Injectable()
export class FreePostReplyCommentHistoryService {
  constructor(
    private readonly freePostReplyCommentHistoryRepository: FreePostReplyCommentHistoryRepository,
  ) {}

  async create(
    userId: number,
    freePostId: number,
    freePostCommentId: number,
    freePostReplyCommentId: number,
    action: HistoryAction,
    createFreePostReplyCommentHistoryDto: CreateFreePostReplyCommentHistoryDto,
  ) {
    return this.freePostReplyCommentHistoryRepository.save({
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
