import { Injectable } from '@nestjs/common';

import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { CreateClubReviewDto } from '@src/apis/club-reviews/dto/create-club-review.dto';
import { ClubReviewRepository } from '@src/apis/club-reviews/repositories/club-review.repository';
import { CLUB_REVIEW_ERROR_CODE } from '@src/constants/error/club-review/club-review-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class ClubReviewsService {
  constructor(private readonly clubReviewRepository: ClubReviewRepository) {}

  async create(
    createClubReviewDto: CreateClubReviewDto,
  ): Promise<ClubReviewDto> {
    const { clubId, userId } = createClubReviewDto;

    const isExistClubReview = await this.clubReviewRepository.exist({
      where: { clubId, userId },
    });

    if (isExistClubReview) {
      throw new HttpConflictException({
        code: CLUB_REVIEW_ERROR_CODE.ALREADY_EXIST_REVIEWED,
      });
    }

    const newClubReview = this.clubReviewRepository.create(
      new CreateClubReviewDto(createClubReviewDto),
    );

    await this.clubReviewRepository.save(newClubReview);

    return new ClubReviewDto(newClubReview);
  }

  async isExistOrNotFound(reviewId: number): Promise<true> {
    const isExistClubReview = await this.clubReviewRepository.exist({
      where: {
        id: reviewId,
      },
    });

    if (!isExistClubReview) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return isExistClubReview;
  }
}
