import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FreeBoardsModule } from './free-boards/free-boards.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, FreeBoardsModule],
})
export class ApiModule {}
