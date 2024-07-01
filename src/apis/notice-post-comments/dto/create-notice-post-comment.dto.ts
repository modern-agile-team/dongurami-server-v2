import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsDefined,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';

import { NOTICE_POST_COMMENT_DESCRIPTION_LENGTH } from '@src/apis/notice-post-comments/constants/notice-post-comment.constant';
import { NoticePostCommentDto } from '@src/apis/notice-post-comments/dto/notice-post-comment.dto';

export class CreateNoticePostCommentDto
  implements
    Pick<NoticePostCommentDto, 'description' | 'isAnonymous'>,
    Partial<Pick<NoticePostCommentDto, 'parentId' | 'depth'>>
{
  @ApiPropertyOptional({
    description: '부모 댓글 ID 해당 값을 주지 않을 경우 최상위 댓글로 안식함',
    format: 'int64',
    nullable: false,
  })
  @IsNumberString({ no_symbols: true })
  @IsOptional()
  parentId?: string;

  @ApiProperty({
    description: '본문',
    minLength: NOTICE_POST_COMMENT_DESCRIPTION_LENGTH.MIN,
    maxLength: NOTICE_POST_COMMENT_DESCRIPTION_LENGTH.MAX,
  })
  @Length(
    NOTICE_POST_COMMENT_DESCRIPTION_LENGTH.MIN,
    NOTICE_POST_COMMENT_DESCRIPTION_LENGTH.MAX,
  )
  description: string;

  @ApiPropertyOptional({
    description: '익명 여부',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous: boolean = false;

  @IsDefined()
  depth: number = 0;
}
