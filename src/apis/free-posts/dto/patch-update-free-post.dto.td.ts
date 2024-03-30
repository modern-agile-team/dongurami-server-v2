import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  ArrayMaxSize,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { FREE_POST_TITLE_LENGTH } from '@src/apis/free-posts/constants/free-post.constant';
import { CreateFreePostDto } from '@src/apis/free-posts/dto/create-free-post.dto';
import {
  POST_TAG_COUNT,
  POST_TAG_NAME_LENGTH,
} from '@src/apis/post-tags/constants/post-tag.constant';

export class PatchUpdateFreePostDto implements Partial<CreateFreePostDto> {
  @ApiPropertyOptional({
    description: '제목',
    nullable: false,
    minLength: FREE_POST_TITLE_LENGTH.MIN,
    maxLength: FREE_POST_TITLE_LENGTH.MAX,
  })
  @IsOptional()
  @Length(FREE_POST_TITLE_LENGTH.MIN, FREE_POST_TITLE_LENGTH.MAX)
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

  @ApiProperty({
    description: '태그 명',
    minLength: POST_TAG_NAME_LENGTH.MIN,
    maxLength: POST_TAG_NAME_LENGTH.MAX,
    minItems: POST_TAG_COUNT.MIN,
    maxItems: POST_TAG_COUNT.MAX,
  })
  @ArrayMaxSize(POST_TAG_COUNT.MAX)
  @IsString({ each: true })
  @IsOptional()
  tagNames?: string[];
}
