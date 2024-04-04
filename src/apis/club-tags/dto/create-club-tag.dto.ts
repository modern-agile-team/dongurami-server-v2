import { ApiProperty } from '@nestjs/swagger';

import { IsArray, Length } from 'class-validator';

import { CLUB_TAG_NAME } from '@src/apis/club-tags/constants/club-tag.constant';

export class CreateClubTagDto {
  @ApiProperty({
    description: '동아리 태그 명',
    minLength: CLUB_TAG_NAME.MIN,
    maxLength: CLUB_TAG_NAME.MAX,
  })
  @IsArray()
  @Length(CLUB_TAG_NAME.MIN, CLUB_TAG_NAME.MAX, { each: true })
  names: string[];
}
