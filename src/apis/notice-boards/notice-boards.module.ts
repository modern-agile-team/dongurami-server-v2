import { Module } from '@nestjs/common';
import { NoticeBoardsController } from './controllers/notice-boards.controller';
import { NoticeBoardsService } from './services/notice-boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeBoard } from '@src/entities/NoticeBoard';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeBoard])],
  controllers: [NoticeBoardsController],
  providers: [NoticeBoardsService],
})
export class NoticeBoardsModule {}
