import { Injectable } from '@nestjs/common';

import mean from 'lodash/mean';
import { getTsid } from 'tsid-ts';

import { ClubReviewStatus } from '@src/apis/club-reviews/constants/club-review.enum';
import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { ClubReviewsItemDto } from '@src/apis/club-reviews/dto/club-reviews-item.dto';
import { CreateClubReviewDto } from '@src/apis/club-reviews/dto/create-club-review.dto';
import { FindClubReviewListQueryDto } from '@src/apis/club-reviews/dto/find-club-review-list-query.dto';
import { PatchUpdateClubReviewDto } from '@src/apis/club-reviews/dto/patch-update-club-review.dto';
import { RemoveClubReviewDto } from '@src/apis/club-reviews/dto/remove-club-review.dto';
import { ScoreDto } from '@src/apis/club-reviews/dto/score.dto';
import { ClubReviewRepository } from '@src/apis/club-reviews/repositories/club-review.repository';
import { CreateReactionDto } from '@src/apis/reactions/dto/create-reaction.dto';
import { RemoveReactionDto } from '@src/apis/reactions/dto/remove-reaction.dto';
import { ReactionsService } from '@src/apis/reactions/services/reactions.service';
import { UsersService } from '@src/apis/users/services/users.service';
import { isNil } from '@src/common/common';
import { CLUB_REVIEW_ERROR_CODE } from '@src/constants/error/club-review/club-review-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ClubReviewReaction } from '@src/entities/ClubReviewReaction';
import { QueryHelper } from '@src/helpers/query.helper';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { HttpConflictException } from '@src/http-exceptions/exceptions/http-conflict.exception';
import { HttpForbiddenException } from '@src/http-exceptions/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';

@Injectable()
export class ClubReviewsService {
  constructor(
    private readonly clubReviewRepository: ClubReviewRepository,
    private readonly queryHelper: QueryHelper,
    private readonly reactionsService: ReactionsService<ClubReviewReaction>,
    private readonly usersService: UsersService,
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

    const newClubReview = this.clubReviewRepository.create({
      id: getTsid().toBigInt().toString(),
      ...new CreateClubReviewDto(createClubReviewDto),
    });

    await this.clubReviewRepository.save(newClubReview);

    const postingUser = await this.usersService.findOneById(userId);

    return new ClubReviewDto({ ...newClubReview, user: postingUser });
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

  async findBest(clubId: string): Promise<ClubReviewDto> {
    const review = await this.clubReviewRepository
      .createQueryBuilder('clubReview')
      .select([
        'clubReview.id',
        'clubReview.clubId',
        'clubReview.userId',
        'clubReview.description',
        'clubReview.starRate',
        'clubReview.isAnonymous',
        'clubReview.createdAt',
        'clubReview.updatedAt',
        'clubReviewReactions.id',
      ])
      .innerJoinAndSelect(
        'clubReview.user',
        'user',
        'clubReview.userId = user.id',
      )
      .leftJoin(
        'clubReview.clubReviewReactions',
        'clubReviewReactions',
        'clubReview.id = clubReviewReactions.parentId',
      )
      .where({
        clubId,
        status: ClubReviewStatus.Posting,
      })
      .groupBy('clubReview.id, clubReviewReactions.id')
      .orderBy('COUNT(DISTINCT clubReviewReactions.id)', 'DESC')
      .getOne();

    if (isNil) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return new ClubReviewDto(review);
  }

  async patchUpdate(
    patchUpdateClubReviewDto: PatchUpdateClubReviewDto,
  ): Promise<ClubReviewDto> {
    const { id, clubId, userId, ...updateProps } = patchUpdateClubReviewDto;

    if (Object.values(updateProps).every((prop) => prop === undefined)) {
      throw new HttpBadRequestException({
        code: COMMON_ERROR_CODE.MISSING_UPDATE_FIELD,
      });
    }

    const oldClubReview = await this.clubReviewRepository.findOne({
      where: { id, clubId },
    });

    if (isNil(oldClubReview)) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    if (oldClubReview.userId !== userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const newClubReview = this.clubReviewRepository.create({
      ...oldClubReview,
      ...updateProps,
    });

    await this.clubReviewRepository.update(
      {
        id,
      },
      {
        ...newClubReview,
      },
    );

    return new ClubReviewDto({ ...newClubReview });
  }

  async remove(removeClubReviewDto: RemoveClubReviewDto): Promise<number> {
    const existClubReview = await this.clubReviewRepository.findOne({
      where: {
        id: removeClubReviewDto.id,
        clubId: removeClubReviewDto.clubId,
      },
    });

    if (isNil(existClubReview)) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    if (existClubReview.userId !== removeClubReviewDto.userId) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const clubReviewUpdateResult = await this.clubReviewRepository.update(
      {
        id: removeClubReviewDto.id,
      },
      {
        ...existClubReview,
        status: ClubReviewStatus.Remove,
        deletedAt: new Date(),
      },
    );

    return clubReviewUpdateResult.affected;
  }

  async isExistOrNotFound(clubId: string, reviewId: string): Promise<true> {
    const isExistClubReview = await this.clubReviewRepository.exist({
      where: {
        clubId,
        id: reviewId,
        status: ClubReviewStatus.Posting,
      },
    });

    if (!isExistClubReview) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    return isExistClubReview;
  }

  async getScore(clubId: string): Promise<ScoreDto> {
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

  async createReaction(
    clubId: string,
    reviewId: string,
    userId: string,
    createReactionDto: CreateReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(clubId, reviewId);

    return this.reactionsService.create(
      createReactionDto.type,
      userId,
      reviewId,
    );
  }

  async removeReaction(
    clubId: string,
    reviewId: string,
    userId: string,
    removeReactionDto: RemoveReactionDto,
  ): Promise<void> {
    await this.isExistOrNotFound(clubId, reviewId);

    return this.reactionsService.remove(
      removeReactionDto.type,
      userId,
      reviewId,
    );
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
