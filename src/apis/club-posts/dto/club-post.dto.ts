import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { CLUB_POST_TAG_NAME_LENGTH } from '@src/apis/club-post-tags/constants/club-post-tag.constant';
import { ClubPostTagDto } from '@src/apis/club-post-tags/dto/club-post-tag.dto';
import {
  CLUB_POST_DESCRIPTION_LENGTH,
  CLUB_POST_TAG_COUNT,
} from '@src/apis/club-posts/constants/club-post.constant';
import { ClubPostStatus } from '@src/apis/club-posts/constants/club-post.enum';
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
    minLength: CLUB_POST_TAG_NAME_LENGTH.MIN,
    maxLength: CLUB_POST_TAG_NAME_LENGTH.MAX,
    minItems: CLUB_POST_TAG_COUNT.MIN,
    maxItems: CLUB_POST_TAG_COUNT.MAX,
    type: [ClubPostTagDto],
  })
  tags: ClubPostTagDto[];

  @Exclude()
  status: ClubPostStatus;

  @Exclude()
  deletedAt: Date;

  constructor(clubPostDto: Partial<ClubPostDto> = {}) {
    super();

    Object.assign(this, clubPostDto);
  }
}
