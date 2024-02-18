import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { NoticePostCommentDto } from '@src/apis/notice-post-comments/dto/notice-post-comment.dto';

export class NoticePostCommentsItemDto extends NoticePostCommentDto {
  @ApiProperty({
    description: '댓글의 하위 댓글 nested 구조',
    type: NoticePostCommentDto,
    isArray: true,
  })
  @Type(() => NoticePostCommentDto)
  children: NoticePostCommentDto[];
}
