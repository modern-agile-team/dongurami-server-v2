import { Module } from '@nestjs/common';
import { FreeBoardsController } from './controllers/free-boards.controller';
import { FreeBoardsService } from './services/free-board.service';

@Module({
  controllers: [FreeBoardsController],
  providers: [FreeBoardsService],
})
export class FreeBoardsModule {}
