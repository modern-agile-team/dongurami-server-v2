import { OmitType } from '@nestjs/swagger';
import { CreateUserRequestBodyDto } from './create-user-request-body.dto';

export class PutUpdateUserDto extends OmitType(CreateUserRequestBodyDto, [
  'loginType',
  'role',
  'password',
  'gender',
]) {}
