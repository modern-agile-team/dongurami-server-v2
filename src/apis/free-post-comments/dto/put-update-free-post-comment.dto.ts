import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateFreePostCommentDto } from '@src/apis/free-post-comments/dto/create-free-post-comment.dto';
import { IsBoolean } from 'class-validator';

export class PutUpdateFreePostCommentDto extends PickType(
  CreateFreePostCommentDto,
  ['description'] as const,
) {
  @ApiProperty({
    description: '익명 여부',
  })
  @IsBoolean()
  isAnonymous: boolean;
}
