import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';

type Statuses = (
  | HttpStatus.UNAUTHORIZED
  | HttpStatus.FORBIDDEN
  | HttpStatus.INTERNAL_SERVER_ERROR
)[];

const decoratorMap: Record<
  Statuses[number],
  (ClassDecorator & MethodDecorator)[]
> = {
  [HttpStatus.UNAUTHORIZED]: [
    ApiBearerAuth(),
    HttpException.swaggerBuilder(HttpStatus.UNAUTHORIZED, [
      COMMON_ERROR_CODE.INVALID_TOKEN,
    ]),
  ],
  [HttpStatus.FORBIDDEN]: [
    ApiBearerAuth(),
    HttpException.swaggerBuilder(HttpStatus.FORBIDDEN, [
      COMMON_ERROR_CODE.PERMISSION_DENIED,
    ]),
  ],
  [HttpStatus.INTERNAL_SERVER_ERROR]: [
    ApiBearerAuth(),
    HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
      COMMON_ERROR_CODE.SERVER_ERROR,
    ]),
  ],
};

export function ApiCommonResponse(
  statuses: Statuses = [
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ],
): ClassDecorator & MethodDecorator {
  return applyDecorators(
    ...statuses.flatMap((arg) => {
      return decoratorMap[arg];
    }),
  );
}
