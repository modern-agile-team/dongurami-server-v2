import { Module } from '@nestjs/common';
import { FreePostCommentHistoryModule } from '@src/apis/free-post-comments/free-post-comment-history/free-post-comment-history.module';
import { FreePostCommentRepository } from '@src/apis/free-post-comments/repositories/free-post-comment.repository';
import { FreePostsModule } from '@src/apis/free-posts/free-posts.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';
import { FreePostCommentsController } from './controllers/free-post-comments.controller';
import { FreePostCommentsService } from './services/free-post-comments.service';

@Module({
  imports: [
    FreePostsModule,
    FreePostCommentHistoryModule,
    TypeOrmExModule.forCustomRepository([FreePostCommentRepository]),
  ],
  controllers: [FreePostCommentsController],
  providers: [FreePostCommentsService, QueryHelper],
  exports: [FreePostCommentsService],
})
export class FreePostCommentsModule {}
