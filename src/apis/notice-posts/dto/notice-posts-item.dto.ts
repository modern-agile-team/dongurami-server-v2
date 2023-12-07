import { OmitType } from '@nestjs/swagger';
import { NoticePostDto } from './notice-post.dto';

export class NoticePostsItemDto extends OmitType(NoticePostDto, [
  'description',
] as const) {}
