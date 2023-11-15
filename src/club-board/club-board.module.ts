import { Module } from '@nestjs/common';
import { ClubBoardController } from './club-board.controller';

@Module({
  controllers: [ClubBoardController]
})
export class ClubBoardModule {}
