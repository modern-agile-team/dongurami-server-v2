import { OmitType } from '@nestjs/swagger';
import { NoticeBoardDto } from './notice-post.dto';

export class NoticeBoardsItemDto extends OmitType(NoticeBoardDto, [
  'description',
] as const) {}
