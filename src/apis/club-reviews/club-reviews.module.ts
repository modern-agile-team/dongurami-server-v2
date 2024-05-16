import { Module } from '@nestjs/common';

import { ClubReviewRepository } from '@src/apis/club-reviews/repositories/club-review.repository';
import { ClubReviewsService } from '@src/apis/club-reviews/services/club-reviews.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { QueryHelper } from '@src/helpers/query.helper';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubReviewRepository])],
  providers: [ClubReviewsService, QueryHelper],
  exports: [TypeOrmExModule, ClubReviewsService],
})
export class ClubReviewsModule {}
