import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsBoolean } from 'class-validator';

import { CreateFreePostDto } from '@src/apis/free-posts/dto/create-free-post.dto';

export class PutUpdateFreePostDto extends PickType(CreateFreePostDto, [
  'title',
  'description',
] as const) {
  @ApiProperty({
    description: '익명 여부',
  })
  @IsBoolean()
  isAnonymous: boolean;
}
