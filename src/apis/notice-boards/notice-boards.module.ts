import { Module } from '@nestjs/common';
import { NoticeBoardsController } from './controllers/notice-boards.controller';
import { NoticeBoardsService } from './services/notice-boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeBoard } from '@src/entities/NoticeBoard';
import { QueryHelper } from '@src/helpers/query.helper';
import { NoticeBoardHistoryModule } from './notice-board-history/notice-board-history.module';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeBoard]), NoticeBoardHistoryModule],
  controllers: [NoticeBoardsController],
  providers: [NoticeBoardsService, QueryHelper],
})
export class NoticeBoardsModule {}
