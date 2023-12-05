import { Module } from '@nestjs/common';
import { RootModule } from '@src/apis/root/root.module';
import { AuthModule } from './auth/auth.module';
import { FreePostsModule } from './free-posts/free-posts.module';
import { MajorModule } from './major/major.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RootModule, AuthModule, UsersModule, FreePostsModule, MajorModule],
})
export class ApiModule {}
