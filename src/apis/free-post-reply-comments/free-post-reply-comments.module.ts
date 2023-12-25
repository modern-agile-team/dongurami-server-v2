import { Module } from '@nestjs/common';
import { FreePostCommentsModule } from '@src/apis/free-post-comments/free-post-comments.module';
import { FreePostReplyCommentHistoryModule } from '@src/apis/free-post-reply-comments/free-post-reply-comment-history/free-post-reply-comment-history.module';
import { FreePostReplyCommentRepository } from '@src/apis/free-posts/repositories/free-post-reply-comment.repository';
import { ReactionsModule } from '@src/apis/reactions/reactions.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { FreePostReplyCommentReaction } from '@src/entities/FreePostReplyCommentReaction';
import { QueryHelper } from '@src/helpers/query.helper';
import { FreePostReplyCommentsController } from './controllers/free-post-reply-comments.controller';
import { FreePostReplyCommentsService } from './services/free-post-reply-comments.service';

@Module({
  imports: [
    FreePostCommentsModule,
    FreePostReplyCommentHistoryModule,
    TypeOrmExModule.forCustomRepository([FreePostReplyCommentRepository]),
    ReactionsModule.forFeature(FreePostReplyCommentReaction),
  ],
  controllers: [FreePostReplyCommentsController],
  providers: [FreePostReplyCommentsService, QueryHelper],
})
export class FreePostReplyCommentsModule {}
