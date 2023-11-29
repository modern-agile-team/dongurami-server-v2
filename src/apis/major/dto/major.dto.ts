import { Major } from '@src/entities/Major';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class MajorDto
  implements
    Pick<Major, 'id' | 'code' | 'name' | 'memo' | 'createdAt' | 'updatedAt'>
{
  @IsNumber()
  id: number;
  @IsString()
  code: string;
  @IsString()
  name: string;
  @IsString()
  memo: string;
  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;

  constructor(majorDto: Partial<MajorDto> = {}) {
    Object.assign(this, majorDto);
  }
}
