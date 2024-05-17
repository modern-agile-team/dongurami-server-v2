import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { ClubReviewDto } from '@src/apis/club-reviews/dto/club-review.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';

export class ClubReviewsItemDto extends ClubReviewDto {
  @ApiProperty({
    description: '동아리 후기 작성 유저 정보',
  })
  @Type(() => UserDto)
  user: UserDto;
}
