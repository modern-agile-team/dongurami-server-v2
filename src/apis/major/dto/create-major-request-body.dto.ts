import { IsString } from 'class-validator';
import { MajorDto } from './major.dto';

export class CreateMajorRequestBodyDto
  implements Pick<MajorDto, 'code' | 'name'>
{
  @IsString()
  code: string;

  @IsString()
  name: string;
}
