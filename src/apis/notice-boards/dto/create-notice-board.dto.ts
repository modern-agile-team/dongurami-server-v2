import { IsNotEmpty, Length } from 'class-validator';
import { NOTICE_BOARD_TITLE_LENGTH } from '../constants/notice-board.constant';
import { NoticeBoardDto } from './notice-board.dto';

export class CreateNoticeBoardDto
  implements Pick<NoticeBoardDto, 'title' | 'description'>
{
  @Length(NOTICE_BOARD_TITLE_LENGTH.MIN, NOTICE_BOARD_TITLE_LENGTH.MAX)
  title: string;

  @IsNotEmpty()
  description: string;
}
