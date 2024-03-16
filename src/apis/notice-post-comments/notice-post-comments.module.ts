import { Module } from '@nestjs/common';

import { NoticePostCommentsController } from '@src/apis/notice-post-comments/controllers/notice-post-comments.controller';
import { NoticePostCommentRepository } from '@src/apis/notice-post-comments/repositories/notice-post-comment.repository';
import { NoticePostCommentsService } from '@src/apis/notice-post-comments/services/notice-post-comments.service';
import { NoticePostsModule } from '@src/apis/notice-posts/notice-posts.module';
import { ReactionsModule } from '@src/apis/reactions/reactions.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { NoticePostCommentReaction } from '@src/entities/NoticePostCommentReaction';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    NoticePostsModule,
    TypeOrmExModule.forCustomRepository([NoticePostCommentRepository]),
    ReactionsModule.forFeature(NoticePostCommentReaction),
  ],
  controllers: [NoticePostCommentsController],
  providers: [NoticePostCommentsService, QueryHelper],
  exports: [NoticePostCommentsService],
})
export class NoticePostCommentsModule {}
