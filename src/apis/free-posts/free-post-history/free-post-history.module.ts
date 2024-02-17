import { Module } from '@nestjs/common';

import { FreePostCommentHistoryRepository } from '@src/apis/free-post-comments/free-post-comment-history/repositories/free-post-comment-history.repository';
import { FreePostReplyCommentHistoryRepository } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/repositories/free-post-reply-comment-history.repository';
import { FreePostHistoryRepository } from '@src/apis/free-posts/free-post-history/repositories/free-post-history.repository';
import { FreePostHistoryService } from '@src/apis/free-posts/free-post-history/services/free-post-history.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      FreePostHistoryRepository,
      FreePostCommentHistoryRepository,
      FreePostReplyCommentHistoryRepository,
    ]),
  ],
  providers: [FreePostHistoryService],
  exports: [FreePostHistoryService],
})
export class FreePostHistoryModule {}
