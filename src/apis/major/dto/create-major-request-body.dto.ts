import { MajorDto } from './major.dto';

export class CreateMajorRequestBodyDto
  implements Pick<MajorDto, 'code' | 'name'>
{
  code: string;
  name: string;
}
