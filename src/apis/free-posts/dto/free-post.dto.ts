import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { FREE_POST_TITLE_LENGTH } from '@src/apis/free-posts/constants/free-post.constant';
import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { BaseDto } from '@src/dto/base.dto';
import { FreePost } from '@src/entities/FreePost';

export class FreePostDto
  extends BaseDto
  implements
    Pick<
      FreePost,
      | 'id'
      | 'userId'
      | 'title'
      | 'description'
      | 'hit'
      | 'isAnonymous'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
{
  @ApiProperty({
    description: '게시글 작성자 고유 ID',
    format: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: '제목',
    minLength: FREE_POST_TITLE_LENGTH.MIN,
    maxLength: FREE_POST_TITLE_LENGTH.MAX,
  })
  title: string;

  @ApiProperty({
    description: '본문',
  })
  description: string;

  @ApiProperty({
    description: '조회수',
    default: 0,
    format: 'integer',
  })
  hit: number;

  @ApiProperty({
    description: '익명 여부',
  })
  isAnonymous: boolean;

  @Exclude()
  status: FreePostStatus;

  @Exclude()
  deletedAt: Date;

  constructor(freePostDto: Partial<FreePostDto> = {}) {
    super();

    Object.assign(this, freePostDto);
  }
}
