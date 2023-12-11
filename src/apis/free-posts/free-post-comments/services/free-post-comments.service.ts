import { Injectable } from '@nestjs/common';
import { FreePostCommentHistoryRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-comment-history.repository';
import { FreePostCommentRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-comment.repository';

@Injectable()
export class FreePostCommentsService {
  constructor(
    private readonly freePostCommentRepository: FreePostCommentRepository,
    private readonly freePostCommentHistoryRepository: FreePostCommentHistoryRepository,
  ) {}

  async create() {}

  findAllAndCount() {}

  async putUpdate() {}

  async patchUpdate() {}

  async remove() {}
}
