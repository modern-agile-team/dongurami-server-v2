import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { ClubPostCommentDto } from '@src/apis/club-post-comments/dto/club-post-comment.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';

export class ClubPostCommentsItemDto extends ClubPostCommentDto {
  @ApiProperty({
    description: '댓글 작성 유저 정보',
  })
  @Type(() => UserDto)
  user: UserDto;
}
