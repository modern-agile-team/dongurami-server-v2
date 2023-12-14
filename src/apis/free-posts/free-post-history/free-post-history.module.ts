import { Module } from '@nestjs/common';
import { FreePostCommentHistoryRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-comment-history.repository';
import { FreePostReplyCommentHistoryRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-reply-comment-history.repository';
import { FreePostHistoryRepository } from '@src/apis/free-posts/free-post-history/repositories/free-post-history.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { FreePostHistoryService } from './services/free-post-history.service';

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
