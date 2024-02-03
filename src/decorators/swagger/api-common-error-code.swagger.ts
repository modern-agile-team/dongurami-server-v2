import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';

export function ApiCommonErrorCode(): ClassDecorator & MethodDecorator {
  return applyDecorators(
    ApiBearerAuth(),
    HttpException.swaggerBuilder(HttpStatus.UNAUTHORIZED, [
      COMMON_ERROR_CODE.INVALID_TOKEN,
    ]),
    HttpException.swaggerBuilder(HttpStatus.FORBIDDEN, [
      COMMON_ERROR_CODE.PERMISSION_DENIED,
    ]),
    HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
      COMMON_ERROR_CODE.SERVER_ERROR,
    ]),
  );
}
