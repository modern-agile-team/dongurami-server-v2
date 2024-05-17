import { Injectable } from '@nestjs/common';

import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { ClubReviewsItemDto } from '@src/apis/club-reviews/dto/club-reviews-item.dto';
import { CreateClubReviewDto } from '@src/apis/club-reviews/dto/create-club-review.dto';
import { FindClubReviewListQueryDto } from '@src/apis/club-reviews/dto/find-club-review-list-query.dto';
import { ClubReviewRepository } from '@src/apis/club-reviews/repositories/club-review.repository';
import { CLUB_REVIEW_ERROR_CODE } from '@src/constants/error/club-review/club-review-error-code.constant';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';

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
}
