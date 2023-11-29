import { ApiProperty } from '@nestjs/swagger';
import { FREE_BOARD_TITLE_LENGTH } from '@src/apis/free-boards/constants/free-board.constant';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { IsBoolean, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateFreeBoardDto
  implements Pick<FreeBoardDto, 'title' | 'description' | 'isAnonymous'>
{
  @ApiProperty({
    description: '제목',
    minLength: FREE_BOARD_TITLE_LENGTH.MIN,
    maxLength: FREE_BOARD_TITLE_LENGTH.MAX,
  })
  @Length(FREE_BOARD_TITLE_LENGTH.MIN, FREE_BOARD_TITLE_LENGTH.MAX)
  title: string;

  @ApiProperty({
    description: '본문',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '익명 여부',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous: boolean = false;
}
