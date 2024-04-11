import { Module } from '@nestjs/common';

import { ClubCategoriesModule } from '@src/apis/club-categories/club-categories.module';
import { ClubCategoryLinksModule } from '@src/apis/club-category-links/club-category-links.module';
import { ClubMembersModule } from '@src/apis/club-members/club-members.module';
import { ClubPostsModule } from '@src/apis/club-posts/club-posts.module';
import { ClubTagLinksModule } from '@src/apis/club-tag-links/club-tag-links.module';
import { ClubTagsModule } from '@src/apis/club-tags/club-tags.module';
import { ClubsController } from '@src/apis/clubs/controllers/clubs.controller';
import { ClubRepository } from '@src/apis/clubs/repositories/club.repository';
import { ClubsService } from '@src/apis/clubs/services/clubs.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ClubRepository]),
    ClubTagLinksModule,
    ClubCategoryLinksModule,
    ClubTagsModule,
    ClubCategoriesModule,
    ClubMembersModule,
    ClubPostsModule,
  ],
  controllers: [ClubsController],
  providers: [ClubsService, QueryHelper],
  exports: [ClubsService],
})
export class ClubsModule {}
