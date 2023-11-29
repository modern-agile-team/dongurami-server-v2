import { Major } from '@src/entities/Major';

export class MajorDto
  implements
    Pick<Major, 'id' | 'code' | 'name' | 'memo' | 'createdAt' | 'updatedAt'>
{
  id: number;
  code: string;
  name: string;
  memo: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(majorDto: Partial<MajorDto> = {}) {
    Object.assign(this, majorDto);
  }
}
