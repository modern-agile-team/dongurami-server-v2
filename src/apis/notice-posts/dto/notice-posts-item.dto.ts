import { OmitType } from '@nestjs/swagger';

import { NoticePostDto } from '@src/apis/notice-posts/dto/notice-post.dto';

export class NoticePostsItemDto extends OmitType(NoticePostDto, [
  'description',
] as const) {}
