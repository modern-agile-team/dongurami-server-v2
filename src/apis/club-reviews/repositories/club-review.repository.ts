import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubReview } from '@src/entities/ClubReview';

@CustomRepository(ClubReview)
export class ClubReviewRepository extends Repository<ClubReview> {}
