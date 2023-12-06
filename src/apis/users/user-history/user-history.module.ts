import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHistory } from '@src/entities/UserHistory';
import { UserHistoryService } from './services/user-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserHistory])],
  providers: [UserHistoryService],
  exports: [UserHistoryService],
})
export class UserHistoryModule {}
