import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpNotFoundException } from '@src/http-exceptions/exceptions/http-not-found.exception';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { Response } from 'express';

/**
 * 404 번 에러를 잡는 exception filter
 * path not found 는 nest 내부적으로 NotFoundException 을 쓰기 떄문에 다른 필터에서 처리
 */
@Catch(HttpNotFoundException)
export class HttpNotFoundExceptionFilter
  implements ExceptionFilter<HttpNotFoundException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: HttpNotFoundException, host: ArgumentsHost): void {
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
