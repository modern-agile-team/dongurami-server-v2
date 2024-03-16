import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsBoolean } from 'class-validator';

import { CreateNoticePostCommentDto } from '@src/apis/notice-post-comments/dto/create-notice-post-comment.dto';

export class PutUpdateNoticePostCommentDto extends PickType(
  CreateNoticePostCommentDto,
  ['parentId', 'description'] as const,
) {
  @ApiProperty({
    description: '익명 여부',
  })
  @IsBoolean()
  isAnonymous: boolean;
}
