import { PickType } from '@nestjs/swagger';
import { CreateNoticeBoardDto } from './create-notice-board.dto';

export class PutUpdateNoticeBoardDto extends PickType(CreateNoticeBoardDto, [
  'title',
  'description',
  'isAllowComment',
] as const) {}
