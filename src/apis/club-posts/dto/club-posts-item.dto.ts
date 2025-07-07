import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import { ClubPostCommentsItemDto } from '@src/apis/club-post-comments/dto/club-post-comments-item.dto';
import { ClubPostDto } from '@src/apis/club-posts/dto/club-post.dto';
import { UserDto } from '@src/apis/users/dto/user.dto';

export class ClubPostsItemDto extends ClubPostDto {
  @ApiProperty({
    description: '게시글 작성 유저 정보',
  })
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({
    description: '게시글에 달린 댓글',
    type: [ClubPostCommentsItemDto],
    maxLength: 1,
  })
  @Type(() => ClubPostCommentsItemDto)
  clubPostComments: ClubPostCommentsItemDto[];

  @ApiProperty({
    description: '게시글에 달린 좋아요 개수',
    format: 'integer',
  })
  likeCount: number;

  @ApiProperty({
    description: '게시글에 달린 댓글 개수',
    format: 'integer',
  })
  commentCount: number;
}
