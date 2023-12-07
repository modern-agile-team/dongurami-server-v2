import { IsBoolean, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { NOTICE_BOARD_TITLE_LENGTH } from '../constants/notice-board.constant';
import { NoticeBoardDto } from './notice-board.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticeBoardDto
  implements Pick<NoticeBoardDto, 'title' | 'description' | 'isAllowComment'>
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
    description: '댓글 허용 여부 (false: 비활성화, true: 허용)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAllowComment: boolean = true;
}
