import { Module } from '@nestjs/common';
import { NoticePostHistoryRepository } from '@src/apis/notice-posts/notice-post-history/repositories/notice-post-history.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { NoticePostHistoryService } from './services/notice-posts-history.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([NoticePostHistoryRepository])],
  providers: [NoticePostHistoryService],
  exports: [NoticePostHistoryService],
})
export class NoticePostHistoryModule {}
