import { PickType } from '@nestjs/swagger';

import { CreateNoticePostDto } from '@src/apis/notice-posts/dto/create-notice-post.dto';

export class PutUpdateNoticePostDto extends PickType(CreateNoticePostDto, [
  'title',
  'description',
  'isAllowComment',
] as const) {}
