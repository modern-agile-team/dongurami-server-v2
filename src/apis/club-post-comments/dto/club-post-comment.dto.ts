import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { CLUB_POST_COMMENT_DESCRIPTION_LENGTH } from '@src/apis/club-post-comments/constants/club-post-comment.constant';
import { ClubPostCommentStatus } from '@src/apis/club-post-comments/constants/club-post-comment.enum';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { BaseDto } from '@src/dto/base.dto';
import { ClubPostComment } from '@src/entities/ClubPostComment';

export class ClubPostCommentDto
  extends BaseDto
  implements
    Pick<
      ClubPostComment,
      | 'id'
      | 'userId'
      | 'clubPostId'
      | 'parentId'
      | 'depth'
      | 'description'
      | 'isAnonymous'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
{
  @ApiProperty({
    description: '댓글 작성자 고유 ID',
    format: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: '동아리 게시글 댓글 작성 유저 정보',
  })
  user: UserDto;

  @ApiProperty({
    description: '게시글 고유 ID',
    format: 'integer',
  })
  clubPostId: number;

  @ApiProperty({
    description: '부모 댓글 ID 해당 값을 주지 않을 경우 최상위 댓글임',
    format: 'integer',
    nullable: true,
  })
  parentId: number | null;

  @ApiProperty({
    description: '댓글 깊이 0부터 시작',
    format: 'integer',
  })
  depth: number;

  @ApiProperty({
    description: '본문',
    minLength: CLUB_POST_COMMENT_DESCRIPTION_LENGTH.MIN,
    maxLength: CLUB_POST_COMMENT_DESCRIPTION_LENGTH.MAX,
  })
  description: string;

  @ApiProperty({
    description: '익명 여부',
  })
  isAnonymous: boolean;

  @Exclude()
  status: ClubPostCommentStatus;

  @Exclude()
  deletedAt: Date | null;

  constructor(clubPostCommentDto: Partial<ClubPostCommentDto> = {}) {
    super();

    Object.assign(this, clubPostCommentDto);

    this.user = clubPostCommentDto.user;
  }
}
