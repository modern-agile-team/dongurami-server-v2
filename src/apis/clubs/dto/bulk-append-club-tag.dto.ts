import { ApiProperty } from '@nestjs/swagger';

import { ArrayNotEmpty, ArrayUnique, Length } from 'class-validator';

import { CLUB_TAG_NAME } from '@src/apis/club-tags/constants/club-tag.constant';

export class BulkAppendClubTagDto {
  @ApiProperty({
    description: '동아리 태그 리스트',
    minLength: CLUB_TAG_NAME.MIN,
    maxLength: CLUB_TAG_NAME.MAX,
    uniqueItems: true,
  })
  @ArrayNotEmpty()
  @ArrayUnique()
  @Length(CLUB_TAG_NAME.MIN, CLUB_TAG_NAME.MAX, { each: true })
  tagNames: string[];
}
