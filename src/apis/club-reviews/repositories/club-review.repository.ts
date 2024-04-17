import { Repository } from 'typeorm';

import { ClubReviewStatus } from '@src/apis/club-reviews/constants/club-review.enum';
import { CreateClubReviewDto } from '@src/apis/club-reviews/dto/create-club-review.dto';
import { IClubReviewRepository } from '@src/apis/club-reviews/repositories/iclub-review.repository';
import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubReview } from '@src/entities/ClubReview';

@CustomRepository(ClubReview)
export class ClubReviewRepository
  extends Repository<ClubReview>
  implements IClubReviewRepository
{
  createClubReview(
    createClubReviewDto: CreateClubReviewDto,
  ): Promise<ClubReview> {
    return this.save(
      this.create({
        ...createClubReviewDto,
        status: ClubReviewStatus.Posting,
      }),
    );
  }

  isExistClubReview(clubId: number, userId: number): Promise<boolean> {
    return this.exist({
      where: { clubId, userId, status: ClubReviewStatus.Posting },
    });
  }
}
