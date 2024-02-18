import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { FreePostCommentDto } from '@src/apis/free-post-comments/dto/free-post-comment.dto';

export class FreePostCommentsItemDto extends FreePostCommentDto {
  @ApiProperty({
    description: '댓글의 하위 댓글 nested 구조',
    type: FreePostCommentDto,
    isArray: true,
  })
  @Type(() => FreePostCommentDto)
  children: FreePostCommentDto[];
}
