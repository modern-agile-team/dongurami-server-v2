import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/types/exception.type';

/**
 * customize status code 500 error exception
 */
export class HttpInternalServerErrorException extends HttpException {
  public readonly ctx: string;
  public readonly stack?: any;

  constructor(
    error: Omit<HttpError<HttpInternalServerErrorException>, 'message'> & {
      ctx: string;
      stack?: any;
    },
  ) {
    const { code, errors, ctx } = error;

    super({
      code,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errors,
    });

    this.ctx = ctx;
    this.stack = this.stack;
  }

  getResponse(): HttpInternalServerErrorException {
    return {
      ...(super.getResponse() as any),
      ctx: this.ctx,
      stack: this.stack,
    } as HttpInternalServerErrorException;
  }
}
