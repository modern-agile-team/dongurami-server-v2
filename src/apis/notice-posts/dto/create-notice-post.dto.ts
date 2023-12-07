import { IsBoolean, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { NOTICE_POST_TITLE_LENGTH } from '../constants/notice-post.constant';
import { NoticePostDto } from './notice-post.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoticePostDto
  implements Pick<NoticePostDto, 'title' | 'description' | 'isAllowComment'>
{
  @ApiProperty({
    description: '공지 게시글 제목',
    minLength: NOTICE_POST_TITLE_LENGTH.MIN,
    maxLength: NOTICE_POST_TITLE_LENGTH.MAX,
  })
  @Length(NOTICE_POST_TITLE_LENGTH.MIN, NOTICE_POST_TITLE_LENGTH.MAX)
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
