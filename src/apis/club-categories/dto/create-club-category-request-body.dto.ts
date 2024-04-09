import { ApiProperty } from '@nestjs/swagger';

import { Length } from 'class-validator';

import {
  CLUB_CATEGORY_MEMO,
  CLUB_CATEGORY_NAME,
} from '@src/apis/club-categories/constants/club-category.constant';
import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';

export class CreateClubCategoryRequestBodyDto
  implements Pick<ClubCategoryDto, 'name'>
{
  @ApiProperty({
    description: '동아리 카테고리 이름',
    minLength: CLUB_CATEGORY_NAME.MIN,
    maxLength: CLUB_CATEGORY_NAME.MAX,
  })
  @Length(CLUB_CATEGORY_NAME.MIN, CLUB_CATEGORY_NAME.MAX)
  name: string;

  @ApiProperty({
    description: '메모',
    minLength: CLUB_CATEGORY_MEMO.MIN,
    maxLength: CLUB_CATEGORY_MEMO.MAX,
  })
  @Length(CLUB_CATEGORY_MEMO.MIN, CLUB_CATEGORY_MEMO.MAX)
  memo: string;
}
