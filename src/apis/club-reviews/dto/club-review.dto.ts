import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import {
  CLUB_REVIEW_DESCRIPTION_LENGTH,
  CLUB_REVIEW_STAR_RATE_RANGE,
} from '@src/apis/club-reviews/constants/club-review.constant';
import { ClubReviewStatus } from '@src/apis/club-reviews/constants/club-review.enum';
import { BaseDto } from '@src/dto/base.dto';
import { ClubReview } from '@src/entities/ClubReview';

export class ClubReviewDto
  extends BaseDto
  implements
    Pick<
      ClubReview,
      | 'id'
      | 'clubId'
      | 'userId'
      | 'description'
      | 'starRate'
      | 'isAnonymous'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
{
  @ApiProperty({
    description: '동아리 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  clubId: number;

  @ApiProperty({
    description: '동아리 후기 작성 유저 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  userId: number;

  @ApiProperty({
    description: '동아리 후기 본문',
    nullable: true,
    minLength: CLUB_REVIEW_DESCRIPTION_LENGTH.MIN,
    maxLength: CLUB_REVIEW_DESCRIPTION_LENGTH.MAX,
  })
  description: string | null;

  @ApiProperty({
    description: '별점',
    format: 'integer',
    minimum: CLUB_REVIEW_STAR_RATE_RANGE.MIN,
    maximum: CLUB_REVIEW_STAR_RATE_RANGE.MAX,
  })
  starRate: number;

  @ApiProperty({
    description: '익명 여부',
    default: true,
  })
  isAnonymous: boolean;

  @Exclude()
  status: ClubReviewStatus;

  @Exclude()
  deletedAt: Date | null;

  constructor(clubReviewDto: Partial<ClubReviewDto> = {}) {
    super();

    Object.assign(this, clubReviewDto);
  }
}
