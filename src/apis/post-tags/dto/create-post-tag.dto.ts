import { ApiProperty } from '@nestjs/swagger';

import { Length } from 'class-validator';

import { POST_TAG_NAME_LENGTH } from '@src/apis/post-tags/constants/post-tag.constant';
import { PostTagDto } from '@src/apis/post-tags/dto/post-tag.dto';

export class CreatePostTagDto implements Pick<PostTagDto, 'name'> {
  @ApiProperty({
    description: '태그 명',
    minLength: POST_TAG_NAME_LENGTH.MIN,
    maxLength: POST_TAG_NAME_LENGTH.MAX,
  })
  @Length(POST_TAG_NAME_LENGTH.MIN, POST_TAG_NAME_LENGTH.MAX)
  name: string;
}
