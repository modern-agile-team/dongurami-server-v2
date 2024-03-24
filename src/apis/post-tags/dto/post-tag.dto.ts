import { ApiProperty, OmitType } from '@nestjs/swagger';

import { BaseDto } from '@src/dto/base.dto';
import { PostTag } from '@src/entities/PostTag';

export class PostTagDto
  extends OmitType(BaseDto, ['updatedAt'])
  implements Pick<PostTag, 'id' | 'userId' | 'name' | 'createdAt'>
{
  @ApiProperty({
    description: '태그 생성 유저 고유 ID',
    format: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: '태그 명',
  })
  name: string;

  constructor(postTagDto: Partial<PostTagDto> = {}) {
    super();

    Object.assign(this, postTagDto);
  }
}
