import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { DevController } from '@src/apis/dev/controllers/dev.controller';
import { ErrorCodeResponseDto } from '@src/apis/dev/dto/error-code-response.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { ApiOperator } from '@src/types/type';
import { CustomValidationError } from '@src/types/custom-validation-errors.type';

export const ApiDev: ApiOperator<keyof DevController> = {
  GetAccessToken: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      ApiOkResponse({
        description: '성공적으로 access-token 발급',
        schema: {
          type: 'string',
          description: '발급된 access-token',
        },
      }),
    );
  },

  FindAllErrorCode: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiOkResponse({ type: ErrorCodeResponseDto }),
    );
  },
};
