import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

import { NOTICE_POST_TITLE_LENGTH } from '@src/apis/notice-posts/constants/notice-post.constant';
import { CreateNoticePostDto } from '@src/apis/notice-posts/dto/create-notice-post.dto';

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
}
