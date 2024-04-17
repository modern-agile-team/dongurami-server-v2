import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import {
  CLUB_POST_DESCRIPTION_LENGTH,
  CLUB_POST_TAG_COUNT,
} from '@src/apis/club-posts/constants/club-post.constant';
import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
import { POST_TAG_NAME_LENGTH } from '@src/apis/post-tags/constants/post-tag.constant';
import { PostTagDto } from '@src/apis/post-tags/dto/post-tag.dto';
import { BaseDto } from '@src/dto/base.dto';
import { ClubPost } from '@src/entities/ClubPost';

export class ClubPostDto
  extends BaseDto
  implements
    Omit<ClubPost, 'club' | 'user' | 'clubPostHistories' | 'clubPostTagLinks'>
{
  @ApiProperty({
    description: '동아리 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  clubId: number;

  @ApiProperty({
    description: '동아리 게시글 작성 유저 고유 ID',
    format: 'integer',
    minimum: 1,
  })
  userId: number;

  @ApiProperty({
    description: '동아리 게시글 본문',
    minLength: CLUB_POST_DESCRIPTION_LENGTH.MIN,
  })
  description: string;

  @ApiProperty({
    description: '동아리 게시글 해시태그',
    minLength: POST_TAG_NAME_LENGTH.MIN,
    maxLength: POST_TAG_NAME_LENGTH.MAX,
    minItems: CLUB_POST_TAG_COUNT.MIN,
    maxItems: CLUB_POST_TAG_COUNT.MAX,
    type: [PostTagDto],
  })
  tags: PostTagDto[];

  @Exclude()
  status: ClubPostStatus;

  @Exclude()
  deletedAt: Date;

  constructor(clubPostDto: Partial<ClubPostDto> = {}) {
    super();

    Object.assign(this, clubPostDto);
  }
}
