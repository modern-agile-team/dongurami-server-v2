import { Module } from '@nestjs/common';

import { AdminsModule } from '@src/apis/admins/admins.module';
import { AttachmentsModule } from '@src/apis/attachments/attachments.module';
import { AuthModule } from '@src/apis/auth/auth.module';
import { AuthSocialModule } from '@src/apis/auth/social/auth-social.module';
import { ClubCategoryLinksModule } from '@src/apis/club-category-links/club-category-links.module';
import { ClubTagLinksModule } from '@src/apis/club-tag-links/club-tag-links.module';
import { ClubsModule } from '@src/apis/clubs/clubs.module';
import { DevModule } from '@src/apis/dev/dev.module';
import { FreePostCommentsModule } from '@src/apis/free-post-comments/free-post-comments.module';
import { FreePostsModule } from '@src/apis/free-posts/free-posts.module';
import { MajorModule } from '@src/apis/major/major.module';
import { NoticePostCommentsModule } from '@src/apis/notice-post-comments/notice-post-comments.module';
import { NoticePostsModule } from '@src/apis/notice-posts/notice-posts.module';
import { PostTagsModule } from '@src/apis/post-tags/post-tags.module';
import { PostsModule } from '@src/apis/posts/posts.module';
import { UsersModule } from '@src/apis/users/users.module';

@Module({
  imports: [
    AdminsModule,
    AuthModule,
    UsersModule,
    MajorModule,
    NoticePostsModule,
    NoticePostCommentsModule,
    FreePostsModule,
    FreePostCommentsModule,
    AuthSocialModule,
    ClubsModule,
    ClubTagLinksModule,
    ClubCategoryLinksModule,
    AttachmentsModule,
    DevModule,
    PostsModule,
    PostTagsModule,
  ],
})
export class ApiModule {}
