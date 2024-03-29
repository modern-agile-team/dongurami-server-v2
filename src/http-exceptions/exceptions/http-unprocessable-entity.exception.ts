import { HttpStatus } from '@nestjs/common';

import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { HttpError } from '@src/http-exceptions/types/exception.type';

/**
 * status code 422 error exception
 */
export class HttpUnprocessableEntityException extends HttpException {
  constructor(error: HttpError<HttpUnprocessableEntityException>) {
    const { code, errors } = error;

    super({
      code,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      errors,
    });
  }

  getResponse(): HttpUnprocessableEntityException {
    return super.getResponse() as HttpUnprocessableEntityException;
  }
}
