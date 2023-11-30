import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from '@src/dto/base.dto';
import { NoticeBoard } from '@src/entities/NoticeBoard';
import {
  NOTICE_BOARD_TITLE_LENGTH,
  NOTICE_BOARD_ALLOW_COMMENT_LENGTH,
} from '../constants/notice-board.constant';

export class NoticeBoardDto
  extends BaseDto
  implements
    Pick<
      NoticeBoard,
      'title' | 'description' | 'hit' | 'allowComment' | 'userId'
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
    description: '공지 게시글 조회수',
    default: 0,
    format: 'integer',
  })
  hit: number;

  @ApiProperty({
    description: '댓글 허용 여부 (0: 비활성화, 1: 허용)',
    minimum: NOTICE_BOARD_ALLOW_COMMENT_LENGTH.MIN,
    maximum: NOTICE_BOARD_ALLOW_COMMENT_LENGTH.MAX,
    default: 1,
  })
  allowComment: number;

  @ApiProperty({
    description: '게시글 작성자 고유 ID',
    format: 'integer',
  })
  userId: number;

  constructor(noticeBoardDto: Partial<NoticeBoardDto> = {}) {
    super();

    Object.assign(this, noticeBoardDto);
  }
}
