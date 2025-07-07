import { PickType } from '@nestjs/swagger';

import { CreateUserDto } from '@src/apis/users/dto/create-user.dto';

export class SignInRequestBodyDto extends PickType(CreateUserDto, [
  'loginType',
  'email',
] as const) {}
