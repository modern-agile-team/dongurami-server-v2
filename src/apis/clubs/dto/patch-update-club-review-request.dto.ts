import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsOptional, Length, Max, Min } from 'class-validator';

import {
  CLUB_REVIEW_DESCRIPTION_LENGTH,
  CLUB_REVIEW_STAR_RATE_RANGE,
} from '@src/apis/club-reviews/constants/club-review.constant';
import { CreateClubReviewRequestBodyDto } from '@src/apis/clubs/dto/create-club-review-request-body.dto';

export class PatchUpdateClubReviewRequestDto
  implements Partial<CreateClubReviewRequestBodyDto>
{
  @ApiPropertyOptional({
    description: '동아리 후기 본문',
    nullable: true,
    minLength: CLUB_REVIEW_DESCRIPTION_LENGTH.MIN,
    maxLength: CLUB_REVIEW_DESCRIPTION_LENGTH.MAX,
  })
  @Length(
    CLUB_REVIEW_DESCRIPTION_LENGTH.MIN,
    CLUB_REVIEW_DESCRIPTION_LENGTH.MAX,
  )
  @IsOptional()
  description?: string | null;

  @ApiPropertyOptional({
    description: '별점',
    format: 'integer',
    minimum: CLUB_REVIEW_STAR_RATE_RANGE.MIN,
    maximum: CLUB_REVIEW_STAR_RATE_RANGE.MAX,
  })
  @Min(CLUB_REVIEW_STAR_RATE_RANGE.MIN)
  @Max(CLUB_REVIEW_STAR_RATE_RANGE.MAX)
  @IsOptional()
  starRate?: number;

  @ApiPropertyOptional({
    description: '익명 여부',
  })
  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
