import { Module } from '@nestjs/common';
import { NoticeBoardsController } from './controllers/notice-boards.controller';
import { NoticeBoardsService } from './services/notice-boards.service';

@Module({
  controllers: [NoticeBoardsController],
  providers: [NoticeBoardsService],
})
export class NoticeBoardsModule {}
