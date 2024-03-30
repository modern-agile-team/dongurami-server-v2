import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { NoticePostDto } from '@src/apis/notice-posts/dto/notice-post.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';

export class NoticePostsItemDto extends OmitType(NoticePostDto, [
  'description',
] as const) {
  @ApiProperty({
    description: '게시글 작성 유저 정보',
  })
  @Type(() => UserDto)
  user: UserDto;
}
