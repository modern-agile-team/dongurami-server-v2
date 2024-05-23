import { ApiProperty, OmitType } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';

export class FreePostsItemDto extends OmitType(FreePostDto, [
  'description',
  'postTags',
] as const) {
  @ApiProperty({
    description: '게시글 작성자, isAnonymous 여부에 따라 null 값을 가짐',
    type: UserDto,
    nullable: true,
  })
  @Type(() => UserDto)
  user: UserDto | null;
}
