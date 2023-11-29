import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FreeBoardModule } from './free-board/services/free-board.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, FreeBoardModule],
})
export class ApiModule {}
