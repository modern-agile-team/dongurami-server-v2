import { Module } from '@nestjs/common';

import { NoticePostHistoryRepository } from '@src/apis/notice-posts/notice-post-history/repositories/notice-post-history.repository';
import { NoticePostHistoryService } from '@src/apis/notice-posts/notice-post-history/services/notice-posts-history.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([NoticePostHistoryRepository])],
  providers: [NoticePostHistoryService],
  exports: [NoticePostHistoryService],
})
export class NoticePostHistoryModule {}
