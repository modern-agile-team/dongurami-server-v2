import { Module } from '@nestjs/common';

import { ClubReviewRepository } from '@src/apis/club-reviews/repositories/club-review.repository';
import { ClubReviewsService } from '@src/apis/club-reviews/services/club-reviews.service';
import { ReactionsModule } from '@src/apis/reactions/reactions.module';
import { UsersModule } from '@src/apis/users/users.module';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { ClubReviewReaction } from '@src/entities/ClubReviewReaction';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ClubReviewRepository]),
    ReactionsModule.forFeature(ClubReviewReaction),
    UsersModule,
  ],
  providers: [ClubReviewsService, QueryHelper],
  exports: [TypeOrmExModule, ClubReviewsService],
})
export class ClubReviewsModule {}
