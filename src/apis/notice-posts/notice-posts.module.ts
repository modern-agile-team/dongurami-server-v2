import { Module } from '@nestjs/common';
import { NoticePostRepository } from '@src/apis/notice-posts/repositories/notice-post.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';
import { NoticePostsController } from './controllers/notice-posts.controller';
import { NoticePostHistoryModule } from './notice-post-history/notice-posts-history.module';
import { NoticePostsService } from './services/notice-posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticePost } from '@src/entities/NoticePost';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoticePost]),
    TypeOrmExModule.forCustomRepository([NoticePostRepository]),
    NoticePostHistoryModule,
  ],
  controllers: [NoticePostsController],
  providers: [NoticePostsService, QueryHelper],
})
export class NoticePostsModule {}
