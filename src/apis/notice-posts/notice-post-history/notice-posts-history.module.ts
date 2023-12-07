import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticePostHistoryService } from './services/notice-posts-history.service';
import { NoticePostHistory } from '@src/entities/NoticePostHistory';

@Module({
  imports: [TypeOrmModule.forFeature([NoticePostHistory])],
  providers: [NoticePostHistoryService],
  exports: [NoticePostHistoryService],
})
export class NoticePostHistoryModule {}
