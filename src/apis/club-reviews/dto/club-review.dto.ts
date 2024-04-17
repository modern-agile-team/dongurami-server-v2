import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

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
    minimum: 1,
  })
  description: string;

  starRate: number;

  isAnonymous: boolean;

  @Exclude()
  deletedAt: Date;
}
