import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  ArrayMaxSize,
  IsBoolean,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { NOTICE_POST_TITLE_LENGTH } from '@src/apis/notice-posts/constants/notice-post.constant';
import { CreateNoticePostDto } from '@src/apis/notice-posts/dto/create-notice-post.dto';
import {
  POST_TAG_COUNT,
  POST_TAG_NAME_LENGTH,
} from '@src/apis/post-tags/constants/post-tag.constant';

export class PatchUpdateNoticePostDto implements Partial<CreateNoticePostDto> {
  @ApiPropertyOptional({
    description: '공지 게시글 제목',
    minLength: NOTICE_POST_TITLE_LENGTH.MIN,
    maxLength: NOTICE_POST_TITLE_LENGTH.MAX,
  })
  @Length(NOTICE_POST_TITLE_LENGTH.MIN, NOTICE_POST_TITLE_LENGTH.MAX)
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: '공지 게시글 본문',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: '댓글 허용 여부 (false: 비활성화, true: 허용)',
  })
  @IsOptional()
  @IsBoolean()
  isAllowComment?: boolean;

  @ApiProperty({
    description: '태그 명',
    minLength: POST_TAG_NAME_LENGTH.MIN,
    maxLength: POST_TAG_NAME_LENGTH.MAX,
    minItems: POST_TAG_COUNT.MIN,
    maxItems: POST_TAG_COUNT.MAX,
  })
  @ArrayMaxSize(POST_TAG_COUNT.MAX)
  @IsString({ each: true })
  @IsOptional()
  tagNames?: string[];
}
