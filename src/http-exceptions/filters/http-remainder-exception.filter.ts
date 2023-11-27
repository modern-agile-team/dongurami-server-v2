import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { HttpExceptionService } from '@src/http-exceptions/services/http-exception.service';
import { Response } from 'express';

/**
 * 다른 exception filter 가 잡지않는 exception 을 잡는 필터
 * 내부적으로 만들어지지 않은 exception 을 사용했기때문에 server error 처리
 */
@Catch(HttpException)
export class HttpRemainderExceptionFilter
  implements ExceptionFilter<HttpException>
{
  constructor(private readonly httpExceptionService: HttpExceptionService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionError = new HttpInternalServerErrorException({
      code: COMMON_ERROR_CODE.SERVER_ERROR,
      ctx: 'server error',
    });

    const responseJson = this.httpExceptionService.buildResponseJson(
      statusCode,
      exceptionError,
    );

    response.status(statusCode).json(responseJson);
  }
}
