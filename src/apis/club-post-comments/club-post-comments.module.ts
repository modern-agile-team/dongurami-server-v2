import { Module } from '@nestjs/common';

import { ClubPostCommentRepository } from '@src/apis/club-post-comments/repositories/club-post-comment.repository';
import { ClubPostCommentsService } from '@src/apis/club-post-comments/services/club-post-comments.service';
import { ClubPostsModule } from '@src/apis/club-posts/club-posts.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ClubPostCommentRepository]),
    ClubPostsModule,
  ],
  providers: [ClubPostCommentsService, QueryHelper],
  exports: [ClubPostCommentsService],
})
export class ClubPostCommentsModule {}
