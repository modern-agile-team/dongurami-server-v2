import { Module } from '@nestjs/common';
import { NoticeBoardsController } from './controllers/notice-posts.controller';
import { NoticeBoardsService } from './services/notice-posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeBoard } from '@src/entities/NoticePost';
import { QueryHelper } from '@src/helpers/query.helper';
import { NoticeBoardHistoryModule } from './notice-post-history/notice-posts-history.module';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeBoard]), NoticeBoardHistoryModule],
  controllers: [NoticeBoardsController],
  providers: [NoticeBoardsService, QueryHelper],
})
export class NoticeBoardsModule {}
