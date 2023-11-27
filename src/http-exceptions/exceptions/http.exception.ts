import { HttpException as NestHttpException } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { HttpError } from '@src/http-exceptions/types/exception.type';
import { ValueOf } from '@src/types/type';

export class HttpException extends NestHttpException {
  public readonly statusCode: ErrorHttpStatusCode;

  public readonly code: ValueOf<typeof ERROR_CODE>;

  public readonly errors?: unknown[];

  constructor(
    error: HttpError<HttpException> & { statusCode: ErrorHttpStatusCode },
  ) {
    const { statusCode, code, errors } = error;

    super(
      {
        code,
        errors,
      },
      statusCode,
    );
  }
}
