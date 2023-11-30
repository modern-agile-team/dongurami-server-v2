import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { AUTH_ERROR_CODE } from '@src/constants/error/auth/auth-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { ApiOperator } from '@src/types/type';
import { ValidationError } from '@src/types/validation-errors.type';
import { NoticeBoardsController } from './notice-boards.controller';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { NoticeBoardDto } from '../dto/notice-board.dto';

export const ApiNoticeBoard: ApiOperator<keyof NoticeBoardsController> = {
  Create: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'NoticeBoardCreate',
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'board',
        NoticeBoardDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [
          COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
          AUTH_ERROR_CODE.ACCOUNT_NOT_FOUND,
          AUTH_ERROR_CODE.DIFFERENT_ACCOUNT_INFORMATION,
        ],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: ValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
      ]),
    );
  },
  FindAll: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'NoticeBoardFindAll',
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'boards',
        NoticeBoardDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [
          COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
          AUTH_ERROR_CODE.ACCOUNT_NOT_FOUND,
          AUTH_ERROR_CODE.DIFFERENT_ACCOUNT_INFORMATION,
        ],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: ValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
      ]),
    );
  },
};
