import { OmitType } from '@nestjs/swagger';
import { CreateUserRequestBodyDto } from './create-user-request-body.dto';

export class PutUpdateUserDto
  implements
    Omit<
      CreateUserRequestBodyDto,
      'loginType' | 'role' | 'password' | 'gender'
    >
{
  name: string;
  email: string;
  phoneNumber: string;
  grade: number;
  profilePath: string;
  majorId: number;
}
