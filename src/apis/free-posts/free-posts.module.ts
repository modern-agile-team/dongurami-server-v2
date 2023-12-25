import { Module } from '@nestjs/common';
import { CommonPostsModule } from '@src/apis/common-posts/common-posts.module';
import { FreePostCommentRepository } from '@src/apis/free-post-comments/repositories/free-post-comment.repository';
import { FreePostHistoryModule } from '@src/apis/free-posts/free-post-history/free-post-history.module';
import { FreePostReplyCommentRepository } from '@src/apis/free-posts/repositories/free-post-reply-comment.repository';
import { FreePostRepository } from '@src/apis/free-posts/repositories/free-post.repository';
import { ReactionsModule } from '@src/apis/reactions/reactions.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { FreePost } from '@src/entities/FreePost';
import { FreePostReaction } from '@src/entities/FreePostReaction';
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
    CommonPostsModule.forFeature(FreePost),
    ReactionsModule.forFeature(FreePostReaction),
  ],
  controllers: [FreePostsController],
  providers: [FreePostsService, QueryHelper],
  exports: [FreePostsService],
})
export class FreePostsModule {}
