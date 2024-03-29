import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { Response } from 'express';

import { HttpUnprocessableEntityException } from '@src/http-exceptions/exceptions/http-unprocessable-entity.exception';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';

/**
 * 400 번 에러를 잡는 exception filter
 */
@Catch(HttpUnprocessableEntityException)
export class HttpUnprocessableEntityExceptionFilter
  implements ExceptionFilter<HttpUnprocessableEntityException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(
    exception: HttpUnprocessableEntityException,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();
    const exceptionError = exception.getResponse();

    const responseJson = this.httpExceptionService.buildResponseJson(
      statusCode,
      exceptionError,
    );

    response.status(statusCode).json(responseJson);
  }
}
