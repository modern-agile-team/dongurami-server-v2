import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { FREE_POST_COMMENT_DESCRIPTION_LENGTH } from '@src/apis/free-post-comments/constants/free-post-comment.constant';
import { FreePostCommentStatus } from '@src/apis/free-post-comments/constants/free-post-comment.enum';
import { BaseDto } from '@src/dto/base.dto';
import { FreePostComment } from '@src/entities/FreePostComment';

export class FreePostCommentDto
  extends BaseDto
  implements
    Pick<
      FreePostComment,
      | 'id'
      | 'userId'
      | 'freePostId'
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
    description: '게시글 고유 ID',
    format: 'integer',
  })
  freePostId: number;

  @ApiProperty({
    description: '댓글 작성자 고유 ID',
    format: 'integer',
  })
  userId: number;

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
    minLength: FREE_POST_COMMENT_DESCRIPTION_LENGTH.MIN,
    maxLength: FREE_POST_COMMENT_DESCRIPTION_LENGTH.MAX,
  })
  description: string;

  @ApiProperty({
    description: '익명 여부',
  })
  isAnonymous: boolean;

  @Exclude()
  status: FreePostCommentStatus;

  @Exclude()
  deletedAt: Date;

  constructor(freePostDto: Partial<FreePostCommentDto> = {}) {
    super();

    Object.assign(this, freePostDto);
  }
}
