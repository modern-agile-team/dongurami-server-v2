import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@src/dto/base.dto';
import { NoticePost } from '@src/entities/NoticePost';
import { NOTICE_POST_TITLE_LENGTH } from '../constants/notice-post.constant';
import { Exclude } from 'class-transformer';
import { NoticePostStatus } from '../constants/notice-post.enum';

export class NoticePostDto
  extends BaseDto
  implements
    Pick<
      NoticePost,
      | 'id'
      | 'title'
      | 'description'
      | 'userId'
      | 'hit'
      | 'isAllowComment'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
{
  @ApiProperty({
    description: '공지 게시글 제목',
    minLength: NOTICE_POST_TITLE_LENGTH.MIN,
    maxLength: NOTICE_POST_TITLE_LENGTH.MAX,
  })
  title: string;

  @ApiProperty({
    description: '공지 게시글 본문',
  })
  description: string;

  @ApiProperty({
    description: '게시글 작성자 고유 ID',
    format: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: '공지 게시글 조회수',
    default: 0,
    format: 'integer',
  })
  hit: number;

  @ApiProperty({
    description: '댓글 허용 여부 (false: 비활성화, true: 허용)',
    default: true,
  })
  isAllowComment: boolean;

  @Exclude()
  status: NoticePostStatus;

  @Exclude()
  deletedAt: Date;

  constructor(noticePostDto: Partial<NoticePostDto> = {}) {
    super();

    Object.assign(this, noticePostDto);
  }
}
