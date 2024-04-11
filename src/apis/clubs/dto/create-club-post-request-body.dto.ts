import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ArrayMaxSize, Length, MinLength } from 'class-validator';

import {
  CLUB_POST_DESCRIPTION_LENGTH,
  CLUB_POST_HASH_TAG_COUNT,
  CLUB_POST_HASH_TAG_ELEMENT_LENGTH,
} from '@src/apis/club-posts/constants/club-post.constant';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';

export class CreateClubPostRequestBodyDto
  implements Pick<ClubPostDto, 'description' | 'hashtag'>
{
  @ApiProperty({
    description: '동아리 게시글 본문',
    minLength: CLUB_POST_DESCRIPTION_LENGTH.MIN,
  })
  @MinLength(CLUB_POST_DESCRIPTION_LENGTH.MIN)
  description: string;

  @ApiPropertyOptional({
    description: '동아리 해시 태그',
    minLength: CLUB_POST_HASH_TAG_ELEMENT_LENGTH.MIN,
    maxLength: CLUB_POST_HASH_TAG_ELEMENT_LENGTH.MAX,
    minItems: CLUB_POST_HASH_TAG_COUNT.MIN,
    maxItems: CLUB_POST_HASH_TAG_COUNT.MAX,
    default: [],
  })
  @ArrayMaxSize(CLUB_POST_HASH_TAG_COUNT.MAX)
  @Length(
    CLUB_POST_HASH_TAG_ELEMENT_LENGTH.MIN,
    CLUB_POST_HASH_TAG_ELEMENT_LENGTH.MAX,
    { each: true },
  )
  hashtag: string[] = [];
}
