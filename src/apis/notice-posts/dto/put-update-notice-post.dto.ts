import { PickType } from '@nestjs/swagger';
import { CreateNoticePostDto } from './create-notice-post.dto';

export class PutUpdateNoticePostDto extends PickType(CreateNoticePostDto, [
  'title',
  'description',
  'isAllowComment',
] as const) {}
