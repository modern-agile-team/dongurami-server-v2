import { Module } from '@nestjs/common';

import { AdminsModule } from '@src/apis/admins/admins.module';
import { AuthModule } from '@src/apis/auth/auth.module';
import { AuthSocialModule } from '@src/apis/auth/social/auth-social.module';
import { ClubCategoryLinksModule } from '@src/apis/club-category-links/club-category-links.module';
import { ClubTagLinksModule } from '@src/apis/club-tag-links/club-tag-links.module';
import { ClubsModule } from '@src/apis/clubs/clubs.module';
import { FreePostCommentsModule } from '@src/apis/free-post-comments/free-post-comments.module';
import { FreePostsModule } from '@src/apis/free-posts/free-posts.module';
import { MajorModule } from '@src/apis/major/major.module';
import { NoticePostsModule } from '@src/apis/notice-posts/notice-posts.module';
import { RootModule } from '@src/apis/root/root.module';
import { UsersModule } from '@src/apis/users/users.module';

@Module({
  imports: [
    AdminsModule,
    RootModule,
    AuthModule,
    UsersModule,
    MajorModule,
    NoticePostsModule,
    FreePostsModule,
    FreePostCommentsModule,
    AuthSocialModule,
    ClubsModule,
    ClubTagLinksModule,
    ClubCategoryLinksModule,
  ],
})
export class ApiModule {}
