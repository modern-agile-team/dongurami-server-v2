import { Repository } from 'typeorm';

import { IClubReviewRepository } from '@src/apis/club-reviews/repositories/iclub-review.repository';
import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubReview } from '@src/entities/ClubReview';

@CustomRepository(ClubReview)
export class ClubReviewRepository
  extends Repository<ClubReview>
  implements IClubReviewRepository {}
