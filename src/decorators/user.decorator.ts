import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { UserDto } from '@src/apis/users/dto/user.dto';

export const User = createParamDecorator(
  (data: keyof UserDto, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();

    return req.user[data] || req.user;
  },
);
