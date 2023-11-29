import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NoticeBoardsModule } from './notice-boards/notice-boards.module';

@Module({
  imports: [AuthModule, UsersModule, NoticeBoardsModule],
})
export class ApiModule {}
