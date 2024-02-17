import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsBoolean, IsNotEmpty, IsOptional, Length } from 'class-validator';

import { FREE_POST_TITLE_LENGTH } from '@src/apis/free-posts/constants/free-post.constant';
import { CreateFreePostDto } from '@src/apis/free-posts/dto/create-free-post.dto';

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
}
