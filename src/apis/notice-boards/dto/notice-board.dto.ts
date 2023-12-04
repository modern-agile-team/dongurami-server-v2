import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@src/dto/base.dto';
import { NoticeBoard } from '@src/entities/NoticeBoard';
import { NOTICE_BOARD_TITLE_LENGTH } from '../constants/notice-board.constant';

export class NoticeBoardDto
  extends BaseDto
  implements
    Pick<
      NoticeBoard,
      | 'id'
      | 'title'
      | 'description'
      | 'userId'
      | 'hit'
      | 'allowComment'
      | 'createdAt'
      | 'updatedAt'
    >
{
  @ApiProperty({
    description: '공지 게시글 제목',
    minLength: NOTICE_BOARD_TITLE_LENGTH.MIN,
    maxLength: NOTICE_BOARD_TITLE_LENGTH.MAX,
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
  allowComment: boolean;

  constructor(noticeBoardDto: Partial<NoticeBoardDto> = {}) {
    super();

    Object.assign(this, noticeBoardDto);
  }
}
