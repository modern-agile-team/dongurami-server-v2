import { Module } from '@nestjs/common';
import { CommonPostsModule } from '@src/apis/common-posts/common-posts.module';
import { FreePostCommentRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-comment.repository';
import { FreePostReplyCommentRepository } from '@src/apis/free-posts/free-post-comments/repositories/free-post-reply-comment.repository';
import { FreePostHistoryModule } from '@src/apis/free-posts/free-post-history/free-post-history.module';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';
import { FreePostsController } from './controllers/free-posts.controller';
import { FreePostsService } from './services/free-posts.service';

@Module({
  imports: [
    FreePostHistoryModule,
    TypeOrmExModule.forCustomRepository([
      FreePostRepository,
      FreePostCommentRepository,
      FreePostReplyCommentRepository,
    ]),
    CommonPostsModule.forFeature(FreePostRepository),
  ],
  controllers: [FreePostsController],
  providers: [FreePostsService, QueryHelper],
})
export class FreePostsModule {}
