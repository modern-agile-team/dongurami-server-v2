import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import {
  FreePost,
  FreePostStatus,
} from '@src/apis/free-posts/entities/free-post.entity';
import { PostTagDto } from '@src/apis/post-tags/dto/post-tag.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { BaseDto } from '@src/dto/base.dto';

export class FreePostDto extends BaseDto {
  @ApiProperty({
    description:
      '게시글 작성자 고유 ID, isAnonymous 여부에 따라 null 값을 가짐',
    nullable: true,
  })
  userId: string | null;

  @ApiProperty({
    description: '제목',
    minLength: FreePost.TITLE_LENGTH.MIN,
    maxLength: FreePost.TITLE_LENGTH.MAX,
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

  @ApiProperty({
    description: '게시글 태그 리스트',
    type: [PostTagDto],
  })
  postTags: PostTagDto[];

  @ApiProperty({
    description: '게시글 작성자, isAnonymous 여부에 따라 null 값을 가짐',
    type: UserDto,
    nullable: true,
  })
  user: UserDto | null;

  constructor(freePostDto: Partial<FreePostDto> = {}) {
    super();

    this.id = freePostDto.id;
    this.userId = freePostDto.userId;
    this.title = freePostDto.title;
    this.description = freePostDto.description;
    this.hit = freePostDto.hit;
    this.isAnonymous = freePostDto.isAnonymous;
    this.status = freePostDto.status;
    this.createdAt = freePostDto.createdAt;
    this.updatedAt = freePostDto.updatedAt;
    this.deletedAt = freePostDto.deletedAt;
    this.postTags = freePostDto.postTags;

    this.user = new UserDto({ ...freePostDto.user });
  }
}
