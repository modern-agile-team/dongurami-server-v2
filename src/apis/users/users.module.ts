import { Module } from '@nestjs/common';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { EncryptionModule } from '@src/libs/encryption/encryption.module';
import { MajorModule } from '../major/major.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    EncryptionModule,
    MajorModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
