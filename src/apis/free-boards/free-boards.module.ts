import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeBoardHistoryModule } from '@src/apis/free-boards/free-board-history/free-board-history.module';
import { FreePost } from '@src/entities/FreePost';
import { FreePostHistory } from '@src/entities/FreePostHistory';
import { QueryHelper } from '@src/helpers/query.helper';
import { FreeBoardsController } from './controllers/free-boards.controller';
import { FreeBoardsService } from './services/free-board.service';

@Module({
  imports: [
    FreeBoardHistoryModule,
    TypeOrmModule.forFeature([FreePost, FreePostHistory]),
  ],
  controllers: [FreeBoardsController],
  providers: [FreeBoardsService, QueryHelper],
})
export class FreeBoardsModule {}
