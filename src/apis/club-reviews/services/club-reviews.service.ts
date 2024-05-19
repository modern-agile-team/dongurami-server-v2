import { Injectable } from '@nestjs/common';

import mean from 'lodash/mean';

import { ClubReviewStatus } from '@src/apis/club-reviews/constants/club-review.enum';
import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { ClubReviewsItemDto } from '@src/apis/club-reviews/dto/club-reviews-item.dto';
import { CreateClubReviewDto } from '@src/apis/club-reviews/dto/create-club-review.dto';
import { FindClubReviewListQueryDto } from '@src/apis/club-reviews/dto/find-club-review-list-query.dto';
import { ScoreDto } from '@src/apis/club-reviews/dto/score.dto';
import { ClubReviewRepository } from '@src/apis/club-reviews/repositories/club-review.repository';
import { CLUB_REVIEW_ERROR_CODE } from '@src/constants/error/club-review/club-review-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class ClubReviewsService {
  constructor(
    private readonly clubReviewRepository: ClubReviewRepository,
    private readonly queryHelper: QueryHelper,
  ) {}

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

  findAllAndCount(
    findClubReviewListQueryDto: FindClubReviewListQueryDto,
  ): Promise<[Omit<ClubReviewsItemDto, 'status' | 'deletedAt'>[], number]> {
    const { page, pageSize, order, ...filter } = findClubReviewListQueryDto;

    const where = this.queryHelper.buildWherePropForFind(filter);

    return this.clubReviewRepository.findAndCount({
      select: {
        id: true,
        clubId: true,
        userId: true,
        description: true,
        starRate: true,
        isAnonymous: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        ...where,
      },
      order,
      skip: page * pageSize,
      take: pageSize,
      relations: {
        user: true,
      },
    });
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

  async getScore(clubId: number): Promise<ScoreDto> {
    const clubReviews = await this.clubReviewRepository.find({
      select: {
        starRate: true,
      },
      where: { clubId, status: ClubReviewStatus.Posting },
    });

    const starRates = clubReviews.map((clubReview) => clubReview.starRate);

    const starRatesCount = this.getStarRatesCount(starRates);
    const average = this.getAverage(starRates);

    return new ScoreDto({ ...starRatesCount, average });
  }

  private getStarRatesCount(starRates: number[]): Omit<ScoreDto, 'average'> {
    return starRates.reduce(
      (acc, cur) => {
        switch (cur) {
          case 5:
            acc.five += 1;
            break;
          case 4:
            acc.four += 1;
            break;
          case 3:
            acc.three += 1;
            break;
          case 2:
            acc.two += 1;
            break;
          case 1:
            acc.one += 1;
            break;
          default:
            break;
        }
        return acc;
      },
      {
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0,
      },
    );
  }

  private getAverage(starRates: number[]): number {
    return mean([...starRates]);
  }
}
