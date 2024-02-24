import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

import { NOTICE_POST_COMMENT_DESCRIPTION_LENGTH } from '@src/apis/notice-post-comments/constants/notice-post-comment.constant';
import { NoticePostCommentStatus } from '@src/apis/notice-post-comments/constants/notice-post-comment.enum';
import { BaseDto } from '@src/dto/base.dto';
import { NoticePostComment } from '@src/entities/NoticePostComment';

export class NoticePostCommentDto
  extends BaseDto
  implements
    Pick<
      NoticePostComment,
      | 'id'
      | 'userId'
      | 'noticePostId'
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
  noticePostId: number;

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
    minLength: NOTICE_POST_COMMENT_DESCRIPTION_LENGTH.MIN,
    maxLength: NOTICE_POST_COMMENT_DESCRIPTION_LENGTH.MAX,
  })
  description: string;

  @ApiProperty({
    description: '익명 여부',
  })
  isAnonymous: boolean;

  @Exclude()
  status: NoticePostCommentStatus;

  @Exclude()
  deletedAt: Date | null;

  constructor(noticePostDto: Partial<NoticePostCommentDto> = {}) {
    super();

    Object.assign(this, noticePostDto);
  }
}
