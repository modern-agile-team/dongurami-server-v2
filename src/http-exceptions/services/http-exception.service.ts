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
}
