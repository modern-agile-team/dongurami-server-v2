import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';

export class FreePostsItemDto extends OmitType(FreePostDto, [
  'description',
] as const) {
  @ApiProperty({
    description: '게시글 작성 유저 정보',
  })
  @Type(() => UserDto)
  user: UserDto;
}
