import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHistoryModule } from '@src/apis/users/user-history/user-history.module';
import { Major } from '@src/entities/Major';
import { User } from '@src/entities/User';
import { EncryptionModule } from '@src/libs/encryption/encryption.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    // 예시용
    // TypeOrmExModule.forCustomRepository([UserRepository]),
    UserHistoryModule,
    TypeOrmModule.forFeature([User, Major]),
    EncryptionModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
