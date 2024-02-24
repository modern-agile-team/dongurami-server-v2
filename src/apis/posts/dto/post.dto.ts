import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { FreePostStatus } from '@src/apis/free-posts/constants/free-post.enum';
import { NoticePostStatus } from '@src/apis/notice-posts/constants/notice-post.enum';
import { PostType } from '@src/apis/posts/constants/post.enum';
import { BaseDto } from '@src/dto/base.dto';

export class PostDto extends BaseDto {
  @ApiProperty({
    description: '게시글 타입',
    enum: PostType,
  })
  type: PostType;

  @ApiProperty({
    description: '게시글 작성자 고유 ID',
    format: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: '게시글 제목',
  })
  title: string;

  @ApiProperty({
    description: '게시글 본문',
  })
  description: string;

  @ApiProperty({
    description: '게시글 조회수',
    default: 0,
    format: 'integer',
  })
  hit: number;

  @Exclude()
  status: NoticePostStatus | FreePostStatus;

  @Exclude()
  deletedAt: Date;

  constructor(noticePostDto: Partial<PostDto> = {}) {
    super();

    Object.assign(this, noticePostDto);
  }
}
