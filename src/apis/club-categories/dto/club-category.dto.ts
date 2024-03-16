import { ApiProperty } from '@nestjs/swagger';

import { BaseDto } from '@src/dto/base.dto';
import { ClubCategory } from '@src/entities/ClubCategory';

export class ClubCategoryDto
  extends BaseDto
  implements Pick<ClubCategory, 'id' | 'userId' | 'name' | 'createdAt'>
{
  @ApiProperty({
    description: '카테고리 생성 유저 고유 ID',
    format: 'integer',
  })
  userId: number;

  @ApiProperty({
    description: '카테고리 명',
  })
  name: string;
}
