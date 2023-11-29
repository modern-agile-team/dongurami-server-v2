import { BaseDto } from '@src/dto/base.dto';
import { Major } from '@src/entities/Major';
import { IsString } from 'class-validator';

export class MajorDto
  extends BaseDto
  implements
    Pick<Major, 'id' | 'code' | 'name' | 'memo' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  code: string;
  @IsString()
  name: string;
  @IsString()
  memo: string;

  constructor(majorDto: Partial<MajorDto> = {}) {
    super();
    Object.assign(this, majorDto);
  }
}
