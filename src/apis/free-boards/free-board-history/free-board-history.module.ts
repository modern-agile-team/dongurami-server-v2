import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreePostHistory } from '@src/entities/FreePostHistory';
import { FreeBoardHistoryService } from './services/free-board-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([FreePostHistory])],
  providers: [FreeBoardHistoryService],
  exports: [FreeBoardHistoryService],
})
export class FreeBoardHistoryModule {}
