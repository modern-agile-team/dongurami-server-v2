import { Injectable } from '@nestjs/common';

import { ClubReviewRepository } from '@src/apis/club-reviews/repositories/club-review.repository';

@Injectable()
export class ClubReviewsService {
  constructor(private readonly clubReviewRepository: ClubReviewRepository) {}
}
