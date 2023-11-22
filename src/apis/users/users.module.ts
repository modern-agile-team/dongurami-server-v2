import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { EncryptionModule } from '@src/libs/encryption/encryption.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), EncryptionModule],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
