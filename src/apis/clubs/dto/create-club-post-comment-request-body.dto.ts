import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsDefined,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';

import { CLUB_POST_COMMENT_DESCRIPTION_LENGTH } from '@src/apis/club-post-comments/constants/club-post-comment.constant';
import { ClubPostCommentDto } from '@src/apis/club-post-comments/dto/club-post-comment.dto';

export class CreateClubPostCommentRequestBodyDto
  implements
    Pick<ClubPostCommentDto, 'description' | 'isAnonymous'>,
    Partial<Pick<ClubPostCommentDto, 'parentId' | 'depth'>>
{
  @ApiProperty({
    description: '본문',
    minLength: CLUB_POST_COMMENT_DESCRIPTION_LENGTH.MIN,
    maxLength: CLUB_POST_COMMENT_DESCRIPTION_LENGTH.MAX,
  })
  @Length(
    CLUB_POST_COMMENT_DESCRIPTION_LENGTH.MIN,
    CLUB_POST_COMMENT_DESCRIPTION_LENGTH.MAX,
  )
  description: string;

  @ApiPropertyOptional({
    description: '익명 여부',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous: boolean = false;

  @ApiPropertyOptional({
    description: '부모 댓글 ID 해당 값을 주지 않을 경우 최상위 댓글로 인식함',
    format: 'int64',
    nullable: false,
  })
  @IsNumberString({ no_symbols: true })
  @IsOptional()
  parentId?: string;

  @IsDefined()
  depth: number = 0;
}
