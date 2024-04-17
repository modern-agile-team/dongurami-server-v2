import { Module } from '@nestjs/common';

import { ClubReviewRepository } from '@src/apis/club-reviews/repositories/club-review.repository';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([ClubReviewRepository])],
  exports: [TypeOrmExModule],
})
export class ClubReviewsModule {}
