import { Module } from '@nestjs/common';

import { AuthModule } from '@src/apis/auth/auth.module';
import { AuthSocialModule } from '@src/apis/auth/social/auth-social.module';
import { FreePostCommentsModule } from '@src/apis/free-post-comments/free-post-comments.module';
import { FreePostReplyCommentsModule } from '@src/apis/free-post-reply-comments/free-post-reply-comments.module';
import { FreePostsModule } from '@src/apis/free-posts/free-posts.module';
import { MajorModule } from '@src/apis/major/major.module';
import { NoticePostCommentsModule } from '@src/apis/notice-post-comments/notice-post-comments.module';
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
    NoticePostCommentsModule,
    FreePostsModule,
    FreePostCommentsModule,
    FreePostReplyCommentsModule,
    AuthSocialModule,
  ],
})
export class ApiModule {}
