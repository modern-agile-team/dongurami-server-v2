import { ApiProperty, OmitType } from '@nestjs/swagger';

import { BaseDto } from '@src/dto/base.dto';

export class PostTagItemDto extends OmitType(BaseDto, ['updatedAt']) {
  @ApiProperty({
    description: '태그 생성 유저 고유 ID',
    nullable: true,
  })
  userId: string | null;

  @ApiProperty({
    description: '태그 명',
  })
  name: string;
}
