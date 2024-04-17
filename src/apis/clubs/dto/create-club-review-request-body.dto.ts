import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsOptional, Length, Max, Min } from 'class-validator';

import {
  CLUB_REVIEW_DESCRIPTION_LENGTH,
  CLUB_REVIEW_STAR_RATE_RANGE,
} from '@src/apis/club-reviews/constants/club-review.constant';
import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { IsNullable } from '@src/decorators/validators/is-nullable.decorator';

export class CreateClubReviewRequestBodyDto
  implements Pick<ClubReviewDto, 'description' | 'starRate' | 'isAnonymous'>
{
  @ApiProperty({
    description: '동아리 후기 본문',
    nullable: true,
    minLength: CLUB_REVIEW_DESCRIPTION_LENGTH.MIN,
    maxLength: CLUB_REVIEW_DESCRIPTION_LENGTH.MAX,
  })
  @IsNullable()
  @Length(
    CLUB_REVIEW_DESCRIPTION_LENGTH.MIN,
    CLUB_REVIEW_DESCRIPTION_LENGTH.MAX,
  )
  description: string | null;

  @ApiProperty({
    description: '별점',
    format: 'integer',
    minimum: CLUB_REVIEW_STAR_RATE_RANGE.MIN,
    maximum: CLUB_REVIEW_STAR_RATE_RANGE.MAX,
  })
  @Min(CLUB_REVIEW_STAR_RATE_RANGE.MIN)
  @Max(CLUB_REVIEW_STAR_RATE_RANGE.MAX)
  starRate: number;

  @ApiPropertyOptional({
    description: '익명 여부',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous: boolean = true;
}
