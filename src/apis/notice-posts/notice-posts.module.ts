import { Module } from '@nestjs/common';
import { NoticePostRepository } from '@src/apis/notice-posts/repositories/notice-post.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';
import { NoticePostsController } from './controllers/notice-posts.controller';
import { NoticePostHistoryModule } from './notice-post-history/notice-posts-history.module';
import { NoticePostsService } from './services/notice-posts.service';
import { CommonPostsModule } from '../common-posts/common-posts.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([NoticePostRepository]),
    CommonPostsModule.forFeature(NoticePostRepository),
    NoticePostHistoryModule,
  ],
  controllers: [NoticePostsController],
  providers: [NoticePostsService, QueryHelper],
})
export class NoticePostsModule {}
