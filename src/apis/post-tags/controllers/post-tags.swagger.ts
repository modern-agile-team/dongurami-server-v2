import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { PostTagsController } from '@src/apis/post-tags/controllers/post-tags.controller';
import { PostTagDto } from '@src/apis/post-tags/dto/post-tag.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { CustomValidationError } from '@src/types/custom-validation-errors.type';
import { ApiOperator } from '@src/types/type';

export const ApiPostTag: ApiOperator<keyof PostTagsController> = {
  Create: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiCommonResponse([HttpStatus.UNAUTHORIZED]),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'postTag',
        PostTagDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
    );
  },
};
