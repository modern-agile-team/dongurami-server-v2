import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { PostDto } from '@src/apis/posts/dto/post.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';

export class PostsItemDto extends OmitType(PostDto, ['description']) {
  @ApiProperty({
    description: '게시글 작성 유저 정보',
  })
  @Type(() => UserDto)
  user: UserDto;
}
