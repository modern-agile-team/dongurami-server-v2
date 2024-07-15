import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  ArrayMaxSize,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

import { CreateFreePostRequestDto } from '@src/apis/free-posts/dto/create-free-post.request-dto';
import { FreePost } from '@src/apis/free-posts/entities/free-post.entity';
import {
  POST_TAG_COUNT,
  POST_TAG_NAME_LENGTH,
} from '@src/apis/post-tags/constants/post-tag.constant';

export class PatchUpdateFreePostRequestDto
  implements Partial<CreateFreePostRequestDto>
{
  @ApiPropertyOptional({
    description: '제목',
    nullable: false,
    minLength: FreePost.TITLE_LENGTH.MIN,
    maxLength: FreePost.TITLE_LENGTH.MAX,
  })
  @IsOptional()
  @Length(FreePost.TITLE_LENGTH.MIN, FreePost.TITLE_LENGTH.MAX)
  title?: string;

  @ApiPropertyOptional({
    description: '본문',
    nullable: false,
  })
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    description: '익명 여부',
    nullable: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @ApiPropertyOptional({
    description: '태그 명',
    minLength: POST_TAG_NAME_LENGTH.MIN,
    maxLength: POST_TAG_NAME_LENGTH.MAX,
    minItems: POST_TAG_COUNT.MIN,
    maxItems: POST_TAG_COUNT.MAX,
  })
  @ArrayMaxSize(POST_TAG_COUNT.MAX)
  @Length(POST_TAG_NAME_LENGTH.MIN, POST_TAG_NAME_LENGTH.MAX, { each: true })
  @IsOptional()
  tagNames?: string[];
}
