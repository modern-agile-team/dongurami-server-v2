import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from '@src/dto/base.dto';
import { ClubTag } from '@src/entities/ClubTag';

export class ClubTagDto
  extends BaseDto
  implements Pick<ClubTag, 'id' | 'userId' | 'name' | 'createdAt'>
{
  @ApiProperty({
    description: '태그 생성 유저 고유 ID',
    format: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: '태그 명',
  })
  name: string;
}
