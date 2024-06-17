import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import {
  ArrayMaxSize,
  IsNumberString,
  IsOptional,
  Length,
  MinLength,
} from 'class-validator';

import {
  CLUB_POST_ATTACHMENT_COUNT,
  CLUB_POST_ATTACHMENT_MIME_TYPE,
} from '@src/apis/club-post-attachments/constants/club-post-attachment.constant';
import {
  CLUB_POST_DESCRIPTION_LENGTH,
  CLUB_POST_TAG_COUNT,
} from '@src/apis/club-posts/constants/club-post.constant';
import { CreateClubPostRequestBodyDto } from '@src/apis/clubs/dto/create-club-post-request-body.dto';
import { POST_TAG_NAME_LENGTH } from '@src/apis/post-tags/constants/post-tag.constant';

export class PatchUpdateClubPostRequestBodyDto extends PartialType(
  CreateClubPostRequestBodyDto,
) {
  @ApiPropertyOptional({
    description: '동아리 게시글 본문',
    minLength: CLUB_POST_DESCRIPTION_LENGTH.MIN,
  })
  @MinLength(CLUB_POST_DESCRIPTION_LENGTH.MIN)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: '동아리 게시글 해시 태그',
    minLength: POST_TAG_NAME_LENGTH.MIN,
    maxLength: POST_TAG_NAME_LENGTH.MAX,
    minItems: CLUB_POST_TAG_COUNT.MIN,
    maxItems: CLUB_POST_TAG_COUNT.MAX,
  })
  @ArrayMaxSize(CLUB_POST_TAG_COUNT.MAX)
  @Length(POST_TAG_NAME_LENGTH.MIN, POST_TAG_NAME_LENGTH.MAX, {
    each: true,
  })
  @IsOptional()
  tagNames?: string[];

  @ApiPropertyOptional({
    description:
      '동아리 게시글 첨부파일. url이 아닌 path <br>' +
      `허용하는 MIME-Type: ${[...CLUB_POST_ATTACHMENT_MIME_TYPE]}`,
    minItems: CLUB_POST_ATTACHMENT_COUNT.MIN,
    maxItems: CLUB_POST_ATTACHMENT_COUNT.MAX,
    format: 'int64',
  })
  @ArrayMaxSize(CLUB_POST_ATTACHMENT_COUNT.MAX)
  @IsNumberString({}, { each: true })
  @IsOptional()
  attachmentPaths?: string[];
}
