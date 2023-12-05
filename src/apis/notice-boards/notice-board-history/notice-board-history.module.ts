import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeBoardHistoryService } from './services/notice-board-history.service';
import { NoticeBoardHistory } from '@src/entities/NoticeBoardHistory';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeBoardHistory])],
  providers: [NoticeBoardHistoryService],
  exports: [NoticeBoardHistoryService],
})
export class NoticeBoardHistoryModule {}
