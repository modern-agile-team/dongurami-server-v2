import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsBoolean } from 'class-validator';

import { CreateFreePostRequestDto } from '@src/apis/free-posts/dto/create-free-post.request-dto';

export class PutUpdateFreePostRequestDto extends PickType(
  CreateFreePostRequestDto,
  ['title', 'description', 'tagNames'] as const,
) {
  @ApiProperty({
    description: '익명 여부',
  })
  @IsBoolean()
  isAnonymous: boolean;
}
