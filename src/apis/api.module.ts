import { Module } from '@nestjs/common';
import { RootModule } from '@src/apis/root/root.module';
import { AuthModule } from './auth/auth.module';
import { FreeBoardsModule } from './free-boards/free-boards.module';
import { MajorModule } from './major/major.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RootModule, AuthModule, UsersModule, FreeBoardsModule, MajorModule],
})
export class ApiModule {}
