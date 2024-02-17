import { ApiProperty } from '@nestjs/swagger';

import {
  MAJOR_CODE_LENGTH,
  MAJOR_MEMO_LENGTH,
  MAJOR_NAME_LENGTH,
} from '@src/apis/major/constants/major.constant';
import { BaseDto } from '@src/dto/base.dto';
import { Major } from '@src/entities/Major';

export class MajorDto
  extends BaseDto
  implements
    Pick<Major, 'id' | 'code' | 'name' | 'memo' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({
    description: '전공 코드',
    minLength: MAJOR_CODE_LENGTH.MIN,
    maxLength: MAJOR_CODE_LENGTH.MAX,
  })
  code: string;

  @ApiProperty({
    description: '전공 이름',
    minLength: MAJOR_NAME_LENGTH.MIN,
    maxLength: MAJOR_NAME_LENGTH.MAX,
  })
  name: string;

  @ApiProperty({
    description: '전공 메모',
    minLength: MAJOR_MEMO_LENGTH.MIN,
    maxLength: MAJOR_MEMO_LENGTH.MAX,
  })
  memo: string;

  constructor(majorDto: Partial<MajorDto> = {}) {
    super();

    Object.assign(this, majorDto);
  }
}
