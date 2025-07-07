import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import {
  CLUB_REVIEW_DESCRIPTION_LENGTH,
  CLUB_REVIEW_STAR_RATE_RANGE,
} from '@src/apis/club-reviews/constants/club-review.constant';
import { ClubReviewStatus } from '@src/apis/club-reviews/constants/club-review.enum';
import { UserDto } from '@src/apis/users/dto/user.dto';
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
    format: 'int64',
  })
  clubId: string;

  @ApiProperty({
    description: '후기 작성자, isAnonymous 여부에 따라 null 값을 가짐',
    type: UserDto,
    nullable: true,
  })
  user: UserDto | null;

  @ApiProperty({
    description: '후기 작성자 고유 ID, isAnonymous 여부에 따라 null 값을 가짐',
    nullable: true,
  })
  userId: string | null;

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
    const {
      id,
      clubId,
      userId,
      user,
      description,
      starRate,
      isAnonymous,
      status,
      createdAt,
      updatedAt,
      deletedAt,
    } = clubReviewDto;
    super();

    this.id = id;
    this.clubId = clubId;
    this.userId = userId;
    this.description = description;
    this.starRate = starRate;
    this.isAnonymous = isAnonymous;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;

    this.user = new UserDto(user);
  }
}
