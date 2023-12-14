import { ApiProperty } from '@nestjs/swagger';
import { FREE_POST_COMMENT_DESCRIPTION_LENGTH } from '@src/apis/free-posts/free-post-comments/constants/free-post-comment.constant';
import { FreePostReplyCommentStatus } from '@src/apis/free-posts/free-post-comments/constants/free-post-comment.enum';
import { BaseDto } from '@src/dto/base.dto';
import { FreePostReplyComment } from '@src/entities/FreePostReplyComment';
import { Exclude } from 'class-transformer';

export class FreePostReplyCommentDto
  extends BaseDto
  implements
    Pick<
      FreePostReplyComment,
      | 'id'
      | 'userId'
      | 'freePostCommentId'
      | 'description'
      | 'isAnonymous'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
{
  @ApiProperty({
    description: '게시글 댓글 고유 ID',
    format: 'integer',
  })
  freePostCommentId: number;

  @ApiProperty({
    description: '대댓글 작성자 고유 ID',
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
  status: FreePostReplyCommentStatus;

  @Exclude()
  deletedAt: Date;

  constructor(freePostDto: Partial<FreePostReplyCommentDto> = {}) {
    super();

    Object.assign(this, freePostDto);
  }
}
