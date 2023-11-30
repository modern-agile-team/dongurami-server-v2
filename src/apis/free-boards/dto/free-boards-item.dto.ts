import { OmitType } from '@nestjs/swagger';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';

export class FreeBoardsItemDto extends OmitType(FreeBoardDto, [
  'description',
] as const) {}
