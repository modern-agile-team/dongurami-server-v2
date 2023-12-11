import { Module } from '@nestjs/common';
import { FreePostCommentHistoryRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-comment-history.repository';
import { FreePostCommentRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-comment.repository';
import { FreePostCommentsService } from '@src/apis/free-posts/free-post-comments/services/free-post-comments.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { FreePostCommentsController } from './controllers/free-post-comments.controller';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      FreePostCommentRepository,
      FreePostCommentHistoryRepository,
    ]),
  ],
  controllers: [FreePostCommentsController],
  providers: [FreePostCommentsService],
})
export class FreePostCommentsModule {}
