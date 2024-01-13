import { Module } from '@nestjs/common';
import { FreePostHistoryModule } from '@src/apis/free-posts/free-post-history/free-post-history.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { FreePostCommentHistoryRepository } from './repositories/free-post-comment-history.repository';
import { FreePostCommentHistoryService } from './services/free-post-comment-history.service';

@Module({
  imports: [
    FreePostHistoryModule,
    TypeOrmExModule.forCustomRepository([FreePostCommentHistoryRepository]),
  ],
  providers: [FreePostCommentHistoryService],
  exports: [FreePostCommentHistoryService],
})
export class FreePostCommentHistoryModule {}
