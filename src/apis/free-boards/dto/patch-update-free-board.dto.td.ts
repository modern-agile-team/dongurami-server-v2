import { ApiPropertyOptional } from '@nestjs/swagger';
import { FREE_BOARD_TITLE_LENGTH } from '@src/apis/free-boards/constants/free-board.constant';
import { IsBoolean, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { CreateFreeBoardDto } from './create-free-board.dto';

export class PatchUpdateFreeBoardDto implements Partial<CreateFreeBoardDto> {
  @ApiPropertyOptional({
    description: '제목',
    nullable: false,
    minLength: FREE_BOARD_TITLE_LENGTH.MIN,
    maxLength: FREE_BOARD_TITLE_LENGTH.MAX,
  })
  @IsOptional()
  @Length(FREE_BOARD_TITLE_LENGTH.MIN, FREE_BOARD_TITLE_LENGTH.MAX)
  title?: string;

  @ApiPropertyOptional({
    description: '본문',
    nullable: false,
  })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    description: '익명 여부',
    nullable: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
