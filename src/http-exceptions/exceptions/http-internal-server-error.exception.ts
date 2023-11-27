import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/types/exception.type';

/**
 * customize status code 500 error exception
 */
export class HttpInternalServerErrorException extends HttpException {
  public readonly ctx: string;

  constructor(
    error: Omit<HttpError<HttpInternalServerErrorException>, 'message'> & {
      ctx: string;
    },
  ) {
    const { code, errors, ctx } = error;

    super({
      code,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errors,
    });

    this.ctx = ctx;
  }

  getResponse(): HttpInternalServerErrorException {
    return super.getResponse() as HttpInternalServerErrorException;
  }
}
