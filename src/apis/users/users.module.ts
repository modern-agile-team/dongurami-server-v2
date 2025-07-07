import { Module } from '@nestjs/common';

import { MajorModule } from '@src/apis/major/major.module';
import { UsersController } from '@src/apis/users/controllers/users.controller';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { UsersService } from '@src/apis/users/services/users.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { EncryptionModule } from '@src/libs/encryption/encryption.module';

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
