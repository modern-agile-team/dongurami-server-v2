import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsBoolean } from 'class-validator';

import { CreateFreePostCommentDto } from '@src/apis/free-post-comments/dto/create-free-post-comment.dto';

export class PutUpdateFreePostCommentDto extends PickType(
  CreateFreePostCommentDto,
  ['parentId', 'description'] as const,
) {
  @ApiProperty({
    description: '익명 여부',
  })
  @IsBoolean()
  isAnonymous: boolean;
}
