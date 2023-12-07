import { Module } from '@nestjs/common';
import { UserHistoryRepository } from '@src/apis/users/user-history/repositories/user-history.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { UserHistoryService } from './services/user-history.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserHistoryRepository])],
  providers: [UserHistoryService],
  exports: [UserHistoryService],
})
export class UserHistoryModule {}
