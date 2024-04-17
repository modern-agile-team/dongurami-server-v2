import { CreateClubReviewDto } from '@src/apis/club-reviews/dto/create-club-review.dto';
import { ClubReview } from '@src/entities/ClubReview';

export interface IClubReviewRepository {
  createClubReview: (
    createClubReviewDto: CreateClubReviewDto,
  ) => Promise<ClubReview>;
}
