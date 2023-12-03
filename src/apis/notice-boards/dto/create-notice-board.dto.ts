import { IsBoolean, IsNotEmpty, Length } from 'class-validator';
import {
  NOTICE_BOARD_ALLOW_COMMENT_LENGTH,
  NOTICE_BOARD_TITLE_LENGTH,
} from '../constants/notice-board.constant';
import { NoticeBoardDto } from './notice-board.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticeBoardDto
  implements Pick<NoticeBoardDto, 'title' | 'description' | 'allowComment'>
{
  @ApiProperty({
    description: '공지 게시글 제목',
    minLength: NOTICE_BOARD_TITLE_LENGTH.MIN,
    maxLength: NOTICE_BOARD_TITLE_LENGTH.MAX,
  })
  @Length(NOTICE_BOARD_TITLE_LENGTH.MIN, NOTICE_BOARD_TITLE_LENGTH.MAX)
  title: string;

  @ApiProperty({
    description: '공지 게시글 본문',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '댓글 허용 여부 (0: 비활성화, 1: 허용)',
    minimum: NOTICE_BOARD_ALLOW_COMMENT_LENGTH.MIN,
    maximum: NOTICE_BOARD_ALLOW_COMMENT_LENGTH.MAX,
    default: 1,
  })
  @IsBoolean()
  allowComment: boolean;
}
