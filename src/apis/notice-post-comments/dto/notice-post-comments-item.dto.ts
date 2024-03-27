import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { NoticePostCommentDto } from '@src/apis/notice-post-comments/dto/notice-post-comment.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';

export class NoticePostCommentsItemDto extends NoticePostCommentDto {
  @ApiProperty({
    description: '댓글 작성 유저 정보',
  })
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({
    description: '댓글의 하위 댓글 nested 구조',
    type: NoticePostCommentsItemDto,
    isArray: true,
  })
  @Type(() => NoticePostCommentsItemDto)
  children: NoticePostCommentsItemDto[];
}
