import { Module } from '@nestjs/common';

import { UserHistoryRepository } from '@src/apis/users/user-history/repositories/user-history.repository';
import { UserHistoryService } from '@src/apis/users/user-history/services/user-history.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserHistoryRepository])],
  providers: [UserHistoryService],
  exports: [UserHistoryService],
})
export class UserHistoryModule {}
