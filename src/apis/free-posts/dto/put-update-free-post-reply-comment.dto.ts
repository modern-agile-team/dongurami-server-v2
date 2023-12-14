import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateFreePostReplyCommentDto } from '@src/apis/free-posts/dto/create-free-post-reply-comment.dto';
import { IsBoolean } from 'class-validator';

export class PutUpdateFreePostReplyCommentDto extends PickType(
  CreateFreePostReplyCommentDto,
  ['description'] as const,
) {
  @ApiProperty({
    description: '익명 여부',
  })
  @IsBoolean()
  isAnonymous: boolean;
}
