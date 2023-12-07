import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeBoardHistoryService } from './services/notice-posts-history.service';
import { NoticeBoardHistory } from '@src/entities/NoticePostHistory';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeBoardHistory])],
  providers: [NoticeBoardHistoryService],
  exports: [NoticeBoardHistoryService],
})
export class NoticeBoardHistoryModule {}
