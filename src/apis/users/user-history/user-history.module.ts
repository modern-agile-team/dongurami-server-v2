import { Module } from '@nestjs/common';
import { UserHistoryService } from './services/user-history.service';

@Module({
  providers: [UserHistoryService],
  exports: [UserHistoryService],
})
export class UserHistoryModule {}
