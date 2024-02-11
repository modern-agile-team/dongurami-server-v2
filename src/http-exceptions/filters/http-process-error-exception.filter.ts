import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpProcessErrorException } from '@src/http-exceptions/exceptions/http-process-error.exception';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { Response } from 'express';

/**
 * node  process error exception
 * ex) ReferenceError, TypeError etc
 */
@Catch()
export class HttpProcessErrorExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const nodeException = new HttpProcessErrorException({
      code: COMMON_ERROR_CODE.SERVER_ERROR,
    });
    const exceptionError = nodeException.getResponse();

    const responseJson = this.httpExceptionService.buildResponseJson(
      statusCode,
      exceptionError,
    );

    this.httpExceptionService.printLog({
      ctx: 'Node Process Error',
      stack: exception.stack,
      request,
      response: {
        body: responseJson,
      },
    });

    response.status(statusCode).json(responseJson);
  }
}
