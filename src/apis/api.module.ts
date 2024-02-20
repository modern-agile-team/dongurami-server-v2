import { Module } from '@nestjs/common';

import { AuthModule } from '@src/apis/auth/auth.module';
import { AuthSocialModule } from '@src/apis/auth/social/auth-social.module';
import { DevModule } from '@src/apis/dev/dev.module';
import { FreePostCommentsModule } from '@src/apis/free-post-comments/free-post-comments.module';
import { FreePostsModule } from '@src/apis/free-posts/free-posts.module';
import { MajorModule } from '@src/apis/major/major.module';
import { NoticePostsModule } from '@src/apis/notice-posts/notice-posts.module';
import { RootModule } from '@src/apis/root/root.module';
import { UsersModule } from '@src/apis/users/users.module';

@Module({
  imports: [
    RootModule,
    AuthModule,
    UsersModule,
    MajorModule,
    NoticePostsModule,
    FreePostsModule,
    FreePostCommentsModule,
    AuthSocialModule,
    DevModule,
  ],
})
export class ApiModule {}
