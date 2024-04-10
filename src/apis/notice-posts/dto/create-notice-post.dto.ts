import { ApiProperty } from '@nestjs/swagger';

import {
  ArrayMaxSize,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

import { NOTICE_POST_TITLE_LENGTH } from '@src/apis/notice-posts/constants/notice-post.constant';
import { NoticePostDto } from '@src/apis/notice-posts/dto/notice-post.dto';
import {
  POST_TAG_COUNT,
  POST_TAG_NAME_LENGTH,
} from '@src/apis/post-tags/constants/post-tag.constant';

export class CreateNoticePostDto
  implements Pick<NoticePostDto, 'title' | 'description' | 'isAllowComment'>
{
  @ApiProperty({
    description: '공지 게시글 제목',
    minLength: NOTICE_POST_TITLE_LENGTH.MIN,
    maxLength: NOTICE_POST_TITLE_LENGTH.MAX,
  })
  @Length(NOTICE_POST_TITLE_LENGTH.MIN, NOTICE_POST_TITLE_LENGTH.MAX)
  title: string;

  @ApiProperty({
    description: '공지 게시글 본문',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '댓글 허용 여부 (false: 비활성화, true: 허용)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAllowComment: boolean = true;

  @ApiProperty({
    description: '태그 명',
    minLength: POST_TAG_NAME_LENGTH.MIN,
    maxLength: POST_TAG_NAME_LENGTH.MAX,
    minItems: POST_TAG_COUNT.MIN,
    maxItems: POST_TAG_COUNT.MAX,
  })
  @ArrayMaxSize(POST_TAG_COUNT.MAX)
  @Length(POST_TAG_NAME_LENGTH.MIN, POST_TAG_NAME_LENGTH.MAX, { each: true })
  tagNames: string[];
}
