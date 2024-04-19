import { Inject, Injectable } from '@nestjs/common';

import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { CreateClubReviewDto } from '@src/apis/club-reviews/dto/create-club-review.dto';
import { ClubReviewRepository } from '@src/apis/club-reviews/repositories/club-review.repository';
import { IClubReviewRepository } from '@src/apis/club-reviews/repositories/club-review.repository.interface';
import { CLUB_REVIEW_ERROR_CODE } from '@src/constants/error/club-review/club-review-error-code.constant';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';

@Injectable()
export class ClubReviewsService {
  constructor(
    @Inject(ClubReviewRepository)
    private readonly clubReviewRepository: IClubReviewRepository,
  ) {}

  async create(
    createClubReviewDto: CreateClubReviewDto,
  ): Promise<ClubReviewDto> {
    const isExistClubReview = await this.clubReviewRepository.isExistClubReview(
      createClubReviewDto.clubId,
      createClubReviewDto.userId,
    );

    if (isExistClubReview) {
      throw new HttpConflictException({
        code: CLUB_REVIEW_ERROR_CODE.ALREADY_REVIEWED,
      });
    }

    const newClubReview = await this.clubReviewRepository.createClubReview(
      new CreateClubReviewDto(createClubReviewDto),
    );

    return new ClubReviewDto(newClubReview);
  }
}
