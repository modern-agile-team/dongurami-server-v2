import { Module } from '@nestjs/common';

import { CommonPostsModule } from '@src/apis/common-posts/common-posts.module';
import { NoticePostsController } from '@src/apis/notice-posts/controllers/notice-posts.controller';
import { NoticePostRepository } from '@src/apis/notice-posts/repositories/notice-post.repository';
import { NoticePostsService } from '@src/apis/notice-posts/services/notice-posts.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { NoticePost } from '@src/entities/NoticePost';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([NoticePostRepository]),
    CommonPostsModule.forFeature(NoticePost),
  ],
  controllers: [NoticePostsController],
  providers: [NoticePostsService, QueryHelper],
  exports: [NoticePostsService],
})
export class NoticePostsModule {}
