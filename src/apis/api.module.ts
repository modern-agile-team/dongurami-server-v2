import { Module } from '@nestjs/common';
import { FreePostCommentsModule } from '@src/apis/free-post-comments/free-post-comments.module';
import { FreePostReplyCommentsModule } from '@src/apis/free-post-reply-comments/free-post-reply-comments.module';
import { FreePostsModule } from '@src/apis/free-posts/free-posts.module';
import { RootModule } from '@src/apis/root/root.module';
import { AuthModule } from './auth/auth.module';
import { MajorModule } from './major/major.module';
import { NoticePostsModule } from './notice-posts/notice-posts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    RootModule,
    AuthModule,
    UsersModule,
    MajorModule,
    NoticePostsModule,
    FreePostsModule,
    FreePostCommentsModule,
    FreePostReplyCommentsModule,
  ],
})
export class ApiModule {}
