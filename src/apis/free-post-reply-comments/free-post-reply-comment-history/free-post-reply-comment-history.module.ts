import { Module } from '@nestjs/common';

import { FreePostCommentHistoryModule } from '@src/apis/free-post-comments/free-post-comment-history/free-post-comment-history.module';
import { FreePostReplyCommentHistoryRepository } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/repositories/free-post-reply-comment-history.repository';
import { FreePostReplyCommentHistoryService } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/services/free-post-reply-comment-history.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [
    FreePostCommentHistoryModule,
    TypeOrmExModule.forCustomRepository([
      FreePostReplyCommentHistoryRepository,
    ]),
  ],
  providers: [FreePostReplyCommentHistoryService],
  exports: [FreePostReplyCommentHistoryService],
})
export class FreePostReplyCommentHistoryModule {}
