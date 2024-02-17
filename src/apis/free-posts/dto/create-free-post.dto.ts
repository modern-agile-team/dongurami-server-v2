import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsOptional, Length } from 'class-validator';

import { FREE_POST_TITLE_LENGTH } from '@src/apis/free-posts/constants/free-post.constant';
import { FreePostDto } from '@src/apis/free-posts/dto/free-post.dto';

export class CreateFreePostDto
  implements Pick<FreePostDto, 'title' | 'description' | 'isAnonymous'>
{
  @ApiProperty({
    description: '제목',
    minLength: FREE_POST_TITLE_LENGTH.MIN,
    maxLength: FREE_POST_TITLE_LENGTH.MAX,
  })
  @Length(FREE_POST_TITLE_LENGTH.MIN, FREE_POST_TITLE_LENGTH.MAX)
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
}
