import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  Length,
} from 'class-validator';

import { CLUB_POST_COMMENT_DESCRIPTION_LENGTH } from '@src/apis/club-post-comments/constants/club-post-comment.constant';
import { CreateClubPostCommentRequestBodyDto } from '@src/apis/clubs/dto/create-club-post-comment-request-body.dto';

export class PatchUpdateClubPostCommentRequestBodyDto
  implements
    Partial<
      Pick<
        CreateClubPostCommentRequestBodyDto,
        'parentId' | 'description' | 'isAnonymous'
      >
    >
{
  @ApiPropertyOptional({
    description: '본문',
    minLength: CLUB_POST_COMMENT_DESCRIPTION_LENGTH.MIN,
    maxLength: CLUB_POST_COMMENT_DESCRIPTION_LENGTH.MAX,
  })
  @Length(
    CLUB_POST_COMMENT_DESCRIPTION_LENGTH.MIN,
    CLUB_POST_COMMENT_DESCRIPTION_LENGTH.MAX,
  )
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: '익명 여부',
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiPropertyOptional({
    description: '부모 댓글 ID 해당 값을 주지 않을 경우 최상위 댓글로 인식함',
    format: 'integer',
    nullable: false,
  })
  @IsPositive()
  @IsInt()
  @IsOptional()
  parentId?: number;
}
