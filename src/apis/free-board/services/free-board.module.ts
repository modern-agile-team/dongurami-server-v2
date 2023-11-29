import { Module } from '@nestjs/common';
import { FreeBoardController } from '../controllers/free-board.controller';
import { FreeBoardService } from '../free-board.service';

@Module({
  controllers: [FreeBoardController],
  providers: [FreeBoardService],
})
export class FreeBoardModule {}
