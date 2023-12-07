import { Module } from '@nestjs/common';
import { MajorRepository } from '@src/apis/major/repositories/major.repository';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { UserHistoryModule } from '@src/apis/users/user-history/user-history.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { EncryptionModule } from '@src/libs/encryption/encryption.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository, MajorRepository]),
    UserHistoryModule,
    EncryptionModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
