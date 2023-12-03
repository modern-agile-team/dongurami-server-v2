import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeBoardHistoryModule } from '@src/apis/free-boards/free-board-history/free-board-history.module';
import { FreeBoard } from '@src/entities/FreeBoard';
import { FreeBoardHistory } from '@src/entities/FreeBoardHistory';
import { QueryHelper } from '@src/helpers/query.helper';
import { FreeBoardsController } from './controllers/free-boards.controller';
import { FreeBoardsService } from './services/free-board.service';

@Module({
  imports: [
    FreeBoardHistoryModule,
    TypeOrmModule.forFeature([FreeBoard, FreeBoardHistory]),
  ],
  controllers: [FreeBoardsController],
  providers: [FreeBoardsService, QueryHelper],
})
export class FreeBoardsModule {}
