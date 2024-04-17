import { Inject, Injectable } from '@nestjs/common';

import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { CreateClubReviewDto } from '@src/apis/club-reviews/dto/create-club-review.dto';
import { ClubReviewRepository } from '@src/apis/club-reviews/repositories/club-review.repository';
import { IClubReviewRepository } from '@src/apis/club-reviews/repositories/iclub-review.repository';

@Injectable()
export class ClubReviewsService {
  constructor(
    @Inject(ClubReviewRepository)
    private readonly clubReviewRepository: IClubReviewRepository,
  ) {}

  async create(
    createClubReviewDto: CreateClubReviewDto,
  ): Promise<ClubReviewDto> {
    const newClubReview = await this.clubReviewRepository.createClubReview({
      ...new CreateClubReviewDto(createClubReviewDto),
    });

    return new ClubReviewDto(newClubReview);
  }
}
