import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { ERROR_MESSAGE } from '@src/constants/error/error-message.constant';
import { ValueOf } from '@src/types/type';

export class ExceptionResponseDto {
  public readonly timestamp: Date;

  public readonly statusCode: ErrorHttpStatusCode;

  public readonly code: ValueOf<typeof ERROR_CODE>;

  public readonly message: ValueOf<typeof ERROR_MESSAGE>;

  public readonly stack?: any;

  public readonly errors: unknown[];

  constructor(error: Omit<ExceptionResponseDto, 'timestamp'>) {
    const { statusCode, code, message, stack, errors } = error;

    this.timestamp = new Date();
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.stack = stack;
    this.errors = errors;
  }
}
