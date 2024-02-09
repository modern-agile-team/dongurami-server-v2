import { Injectable } from '@nestjs/common';
import { ERROR_CODE } from '@src/constants/error/error-code.constant';
import { ERROR_MESSAGE } from '@src/constants/error/error-message.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { ExceptionResponseDto } from '@src/http-exceptions/dto/exception-response.dto';
import { ValueOf } from '@src/types/type';

interface ExceptionError {
  code: ValueOf<typeof ERROR_CODE>;
  errors?: unknown[];
  stack?: any;
}

interface LogInfo {
  ctx: string;
  stack?: any;
  request: Partial<Request> & { user?: Record<string, any> };
  response: Partial<Omit<Response, 'body'>> & { body?: Record<any, any> };
}

@Injectable()
export class HttpExceptionService {
  constructor(private readonly appConfigService: AppConfigService) {}

  buildResponseJson(
    statusCode: number,
    exceptionError: ExceptionError,
  ): ExceptionResponseDto {
    const isProduction = this.appConfigService.isProduction();
    const { code, errors } = exceptionError;

    return new ExceptionResponseDto({
      statusCode,
      code,
      message: ERROR_MESSAGE[code],
      errors,
      stack:
        statusCode >= 500 && isProduction ? exceptionError.stack : undefined,
    });
  }

  printLog(logInfo: LogInfo): void {
    const { ctx, stack, request, response } = logInfo;

    console.error({
      ctx,
      stack,
      request: {
        method: request.method,
        url: request.url,
        body: request.body,
        currentUser: request.user,
      },
      response: {
        body: Object.assign({}, response.body),
      },
    });
  }
}
