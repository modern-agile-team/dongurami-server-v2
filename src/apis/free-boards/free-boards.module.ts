import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreeBoard } from '@src/entities/FreeBoard';
import { FreeBoardHistory } from '@src/entities/FreeBoardHistory';
import { FreeBoardsController } from './controllers/free-boards.controller';
import { FreeBoardsService } from './services/free-board.service';

@Module({
  imports: [TypeOrmModule.forFeature([FreeBoard, FreeBoardHistory])],
  controllers: [FreeBoardsController],
  providers: [FreeBoardsService],
})
export class FreeBoardsModule {}
