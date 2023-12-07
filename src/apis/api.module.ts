import { Module } from '@nestjs/common';
import { RootModule } from '@src/apis/root/root.module';
import { AuthModule } from './auth/auth.module';
import { FreeBoardsModule } from './free-boards/free-boards.module';
import { NoticeBoardsModule } from './notice-posts/notice-posts.module';
import { MajorModule } from './major/major.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    RootModule,
    AuthModule,
    UsersModule,
    FreeBoardsModule,
    MajorModule,
    NoticeBoardsModule,
  ],
})
export class ApiModule {}
