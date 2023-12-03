import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpUnauthorizedException } from '@src/http-exceptions/exceptions/http-unauthorized.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      console.log(err, user);
      throw new HttpUnauthorizedException({
        code: COMMON_ERROR_CODE.INVALID_TOKEN,
      });
    }
    return user;
  }
}
