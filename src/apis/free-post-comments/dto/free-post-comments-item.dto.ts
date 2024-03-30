import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { FreePostCommentDto } from '@src/apis/free-post-comments/dto/free-post-comment.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';

export class FreePostCommentsItemDto extends FreePostCommentDto {
  @ApiProperty({
    description: '댓글 작성 유저 정보',
  })
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({
    description: '댓글의 하위 댓글 nested 구조',
    type: FreePostCommentsItemDto,
    isArray: true,
  })
  @Type(() => FreePostCommentsItemDto)
  children: FreePostCommentsItemDto[];
}
