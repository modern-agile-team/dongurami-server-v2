import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeBoardHistory } from '@src/entities/FreeBoardHistory';
import { FreeBoardHistoryService } from './services/free-board-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([FreeBoardHistory])],
  providers: [FreeBoardHistoryService],
  exports: [FreeBoardHistoryService],
})
export class FreeBoardHistoryModule {}
