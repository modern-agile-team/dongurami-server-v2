import { Module } from '@nestjs/common';

import { FreePostCommentHistoryRepository } from '@src/apis/free-post-comments/free-post-comment-history/repositories/free-post-comment-history.repository';
import { FreePostCommentHistoryService } from '@src/apis/free-post-comments/free-post-comment-history/services/free-post-comment-history.service';
import { FreePostHistoryModule } from '@src/apis/free-posts/free-post-history/free-post-history.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [
    FreePostHistoryModule,
    TypeOrmExModule.forCustomRepository([FreePostCommentHistoryRepository]),
  ],
  providers: [FreePostCommentHistoryService],
  exports: [FreePostCommentHistoryService],
})
export class FreePostCommentHistoryModule {}
