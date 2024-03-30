import { Module } from '@nestjs/common';

import { CommonPostsModule } from '@src/apis/common-posts/common-posts.module';
import { NoticePostsController } from '@src/apis/notice-posts/controllers/notice-posts.controller';
import { NoticePostTagLinkRepository } from '@src/apis/notice-posts/repositories/notice-post-tag-links.repository';
import { NoticePostRepository } from '@src/apis/notice-posts/repositories/notice-post.repository';
import { NoticePostsService } from '@src/apis/notice-posts/services/notice-posts.service';
import { PostTagsModule } from '@src/apis/post-tags/post-tags.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { NoticePost } from '@src/entities/NoticePost';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      NoticePostRepository,
      NoticePostTagLinkRepository,
    ]),
    CommonPostsModule.forFeature(NoticePost),
    PostTagsModule,
  ],
  controllers: [NoticePostsController],
  providers: [NoticePostsService, QueryHelper],
  exports: [NoticePostsService],
})
export class NoticePostsModule {}
