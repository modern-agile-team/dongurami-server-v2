import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/types/exception.type';

/**
 * status code 401 error exception
 */
export class HttpUnauthorizedException extends HttpException {
  constructor(error: HttpError<HttpUnauthorizedException>) {
    const { code, errors } = error;

    super({
      code,
      statusCode: HttpStatus.UNAUTHORIZED,
      errors,
    });
  }

  getResponse(): HttpUnauthorizedException {
    return super.getResponse() as HttpUnauthorizedException;
  }
}
