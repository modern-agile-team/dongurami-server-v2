import { ApiProperty } from '@nestjs/swagger';

import {
  ArrayMaxSize,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';
import { FreePost } from '@src/apis/free-posts/entities/free-post.entity';
import {
  POST_TAG_COUNT,
  POST_TAG_NAME_LENGTH,
} from '@src/apis/post-tags/constants/post-tag.constant';

export class CreateFreePostRequestDto
  implements Pick<FreePostDto, 'title' | 'description' | 'isAnonymous'>
{
  @ApiProperty({
    description: '제목',
    minLength: FreePost.TITLE_LENGTH.MIN,
    maxLength: FreePost.TITLE_LENGTH.MAX,
  })
  @Length(FreePost.TITLE_LENGTH.MIN, FreePost.TITLE_LENGTH.MAX)
  title: string;

  @ApiProperty({
    description: '본문',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '익명 여부',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous: boolean = false;

  @ApiProperty({
    description: '태그 명',
    minLength: POST_TAG_NAME_LENGTH.MIN,
    maxLength: POST_TAG_NAME_LENGTH.MAX,
    minItems: POST_TAG_COUNT.MIN,
    maxItems: POST_TAG_COUNT.MAX,
  })
  @ArrayMaxSize(POST_TAG_COUNT.MAX)
  @Length(POST_TAG_NAME_LENGTH.MIN, POST_TAG_NAME_LENGTH.MAX, { each: true })
  tagNames: string[];
}
