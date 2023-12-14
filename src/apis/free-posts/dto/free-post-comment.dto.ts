import { ApiProperty } from '@nestjs/swagger';
import { FREE_POST_COMMENT_DESCRIPTION_LENGTH } from '@src/apis/free-posts/constants/free-post-comment.constant';
import { FreePostCommentStatus } from '@src/apis/free-posts/constants/free-post-comment.enum';
import { BaseDto } from '@src/dto/base.dto';
import { FreePostComment } from '@src/entities/FreePostComment';
import { Exclude } from 'class-transformer';

export class FreePostCommentDto
  extends BaseDto
  implements
    Pick<
      FreePostComment,
      | 'id'
      | 'userId'
      | 'freePostId'
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
