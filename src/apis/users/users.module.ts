import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@src/apis/users/repositories/user.repository';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
