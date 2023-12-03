import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { FreeBoardsModule } from './free-boards/free-boards.module';
import { UsersModule } from './users/users.module';
import { NoticeBoardsModule } from './notice-boards/notice-boards.module';
import { MajorModule } from './major/major.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    FreeBoardsModule,
    MajorModule,
    NoticeBoardsModule,
  ],
})
export class ApiModule {}
