import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ArrayMaxSize, Length, MinLength } from 'class-validator';

import {
  CLUB_POST_ATTACHMENT_COUNT,
  CLUB_POST_ATTACHMENT_PATH_LENGTH,
} from '@src/apis/club-post-attachments/constants/club-post-attachment.constant';
import {
  CLUB_POST_DESCRIPTION_LENGTH,
  CLUB_POST_TAG_COUNT,
} from '@src/apis/club-posts/constants/club-post.constant';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { POST_TAG_NAME_LENGTH } from '@src/apis/post-tags/constants/post-tag.constant';

export class CreateClubPostRequestBodyDto
  implements Pick<ClubPostDto, 'description'>
{
  @ApiProperty({
    description: '동아리 게시글 본문',
    minLength: CLUB_POST_DESCRIPTION_LENGTH.MIN,
  })
  @MinLength(CLUB_POST_DESCRIPTION_LENGTH.MIN)
  description: string;

  @ApiPropertyOptional({
    description: '동아리 게시글 해시 태그',
    minLength: POST_TAG_NAME_LENGTH.MIN,
    maxLength: POST_TAG_NAME_LENGTH.MAX,
    minItems: CLUB_POST_TAG_COUNT.MIN,
    maxItems: CLUB_POST_TAG_COUNT.MAX,
    default: [],
  })
  @ArrayMaxSize(CLUB_POST_TAG_COUNT.MAX)
  @Length(POST_TAG_NAME_LENGTH.MIN, POST_TAG_NAME_LENGTH.MAX, {
    each: true,
  })
  tagNames: string[] = [];

  @ApiPropertyOptional({
    description:
      '동아리 게시글 첨부파일. url이 아닌 path' +
      '<br> 이미지의 경우 JPG,JPEG,PNG 형식만 업로드 가능' +
      '<br> 비디오의 경우 MP4, MPEG4, MOV 형식만 업로드 가능',
    minLength: CLUB_POST_ATTACHMENT_PATH_LENGTH.MIN,
    maxLength: CLUB_POST_ATTACHMENT_PATH_LENGTH.MAX,
    minItems: CLUB_POST_ATTACHMENT_COUNT.MIN,
    maxItems: CLUB_POST_ATTACHMENT_COUNT.MAX,
    default: [],
  })
  @ArrayMaxSize(CLUB_POST_ATTACHMENT_COUNT.MAX)
  @Length(
    CLUB_POST_ATTACHMENT_PATH_LENGTH.MIN,
    CLUB_POST_ATTACHMENT_PATH_LENGTH.MAX,
    { each: true },
  )
  filePaths: string[] = [];
}
