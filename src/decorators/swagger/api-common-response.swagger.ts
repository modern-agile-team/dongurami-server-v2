import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';

type Statuses = (401 | 403 | 500)[];

const decoratorMap: Record<
  Statuses[number],
  (ClassDecorator & MethodDecorator)[]
> = {
  401: [
    ApiBearerAuth(),
    HttpException.swaggerBuilder(HttpStatus.UNAUTHORIZED, [
      COMMON_ERROR_CODE.INVALID_TOKEN,
    ]),
  ],
  403: [
    ApiBearerAuth(),
    HttpException.swaggerBuilder(HttpStatus.FORBIDDEN, [
      COMMON_ERROR_CODE.PERMISSION_DENIED,
    ]),
  ],
  500: [
    ApiBearerAuth(),
    HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
      COMMON_ERROR_CODE.SERVER_ERROR,
    ]),
  ],
};

export function ApiCommonResponse(
  statuses: Statuses = [401, 403, 500],
): ClassDecorator & MethodDecorator {
  return applyDecorators(
    ...statuses.flatMap((arg) => {
      return decoratorMap[arg];
    }),
  );
}
