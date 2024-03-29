import { IsNumberString, Length } from 'class-validator';
import { MajorDto } from './major.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  MAJOR_CODE_LENGTH,
  MAJOR_MEMO_LENGTH,
  MAJOR_NAME_LENGTH,
} from '../constants/major.constant';

export class CreateMajorRequestBodyDto
  implements Pick<MajorDto, 'code' | 'name' | 'memo'>
{
  @ApiProperty({
    description: '전공 코드',
    minLength: MAJOR_CODE_LENGTH.MIN,
    maxLength: MAJOR_CODE_LENGTH.MAX,
  })
  @Length(MAJOR_CODE_LENGTH.MIN, MAJOR_CODE_LENGTH.MAX)
  @IsNumberString()
  code: string;

  @ApiProperty({
    description: '전공 이름',
    minLength: MAJOR_NAME_LENGTH.MIN,
    maxLength: MAJOR_NAME_LENGTH.MAX,
  })
  @Length(MAJOR_NAME_LENGTH.MIN, MAJOR_NAME_LENGTH.MAX)
  name: string;

  @ApiProperty({
    description: '전공 생성한 이유 메모',
    minLength: MAJOR_MEMO_LENGTH.MIN,
    maxLength: MAJOR_MEMO_LENGTH.MAX,
  })
  @Length(MAJOR_MEMO_LENGTH.MIN, MAJOR_MEMO_LENGTH.MAX)
  memo: string;
}
