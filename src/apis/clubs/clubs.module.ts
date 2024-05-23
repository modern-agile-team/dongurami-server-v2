import { Module } from '@nestjs/common';

import { ClubApplicationFormModule } from '@src/apis/club-application-form/club-application-form.module';
import { ClubApplicationsModule } from '@src/apis/club-applications/club-applications.module';
import { ClubCategoriesModule } from '@src/apis/club-categories/club-categories.module';
import { ClubCategoryLinksModule } from '@src/apis/club-category-links/club-category-links.module';
import { ClubMembersModule } from '@src/apis/club-members/club-members.module';
import { ClubPostCommentsModule } from '@src/apis/club-post-comments/club-post-comments.module';
import { ClubPostTagLinkRepository } from '@src/apis/club-post-tag-links/repositories/club-post-tag-link.repository';
import { ClubPostsModule } from '@src/apis/club-posts/club-posts.module';
import { ClubReviewsModule } from '@src/apis/club-reviews/club-reviews.module';
import { ClubTagLinksModule } from '@src/apis/club-tag-links/club-tag-links.module';
import { ClubTagsModule } from '@src/apis/club-tags/club-tags.module';
import { ClubsController } from '@src/apis/clubs/controllers/clubs.controller';
import { ClubRepository } from '@src/apis/clubs/repositories/club.repository';
import { ClubsService } from '@src/apis/clubs/services/clubs.service';
import { PostTagsModule } from '@src/apis/post-tags/post-tags.module';
import { ReactionsModule } from '@src/apis/reactions/reactions.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { ClubReviewReaction } from '@src/entities/ClubReviewReaction';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      ClubRepository,
      ClubPostTagLinkRepository,
    ]),
    ClubTagLinksModule,
    ClubCategoryLinksModule,
    ClubTagsModule,
    ClubCategoriesModule,
    ClubMembersModule,
    ClubPostsModule,
    ClubApplicationFormModule,
    PostTagsModule,
    ClubReviewsModule,
    ClubApplicationsModule,
    ClubPostCommentsModule,
    ReactionsModule.forFeature(ClubReviewReaction),
  ],
  controllers: [ClubsController],
  providers: [ClubsService, QueryHelper],
  exports: [ClubsService],
})
export class ClubsModule {}
