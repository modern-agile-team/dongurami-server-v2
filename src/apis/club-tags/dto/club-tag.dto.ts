import { ApiProperty, OmitType } from '@nestjs/swagger';

import { BaseDto } from '@src/dto/base.dto';
import { ClubTag } from '@src/entities/ClubTag';

export class ClubTagDto
  extends OmitType(BaseDto, ['updatedAt'])
  implements Pick<ClubTag, 'id' | 'userId' | 'name' | 'createdAt'>
{
  @ApiProperty({
    description: '태그 생성 유저 고유 ID',
    format: 'int64',
  })
  userId: string;

  @ApiProperty({
    description: '태그 명',
  })
  name: string;

  constructor(clubTagDto: Partial<ClubTagDto> = {}) {
    super();

    Object.assign(this, clubTagDto);
  }
}
