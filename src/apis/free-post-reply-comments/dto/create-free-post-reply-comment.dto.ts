import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FreePostReplyComment } from '@src/entities/FreePostReplyComment';
import { IsBoolean, IsOptional, Length } from 'class-validator';
import { FREE_POST_REPLY_COMMENT_DESCRIPTION_LENGTH } from '../constants/free-post-reply-comment.constant';

export class CreateFreePostReplyCommentDto
  implements Pick<FreePostReplyComment, 'description' | 'isAnonymous'>
{
  @ApiProperty({
    description: '본문',
    minLength: FREE_POST_REPLY_COMMENT_DESCRIPTION_LENGTH.MIN,
    maxLength: FREE_POST_REPLY_COMMENT_DESCRIPTION_LENGTH.MAX,
  })
  @Length(
    FREE_POST_REPLY_COMMENT_DESCRIPTION_LENGTH.MIN,
    FREE_POST_REPLY_COMMENT_DESCRIPTION_LENGTH.MAX,
  )
  description: string;

  @ApiPropertyOptional({
    description: '익명 여부',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous: boolean = false;
}
