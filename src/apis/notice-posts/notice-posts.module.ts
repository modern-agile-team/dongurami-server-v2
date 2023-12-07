import { Module } from '@nestjs/common';
import { NoticePostsController } from './controllers/notice-posts.controller';
import { NoticePostsService } from './services/notice-posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticePost } from '@src/entities/NoticePost';
import { QueryHelper } from '@src/helpers/query.helper';
import { NoticePostHistoryModule } from './notice-post-history/notice-posts-history.module';

@Module({
  imports: [TypeOrmModule.forFeature([NoticePost]), NoticePostHistoryModule],
  controllers: [NoticePostsController],
  providers: [NoticePostsService, QueryHelper],
})
export class NoticePostsModule {}
