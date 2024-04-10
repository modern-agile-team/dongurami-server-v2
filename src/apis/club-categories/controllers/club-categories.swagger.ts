import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { ClubCategoriesController } from '@src/apis/club-categories/controllers/club-categories.controller';
import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { CommonResponseDto } from '@src/interceptors/success-interceptor/dto/common-response.dto';
import { CustomValidationError } from '@src/types/custom-validation-errors.type';
import { ApiOperator } from '@src/types/type';

export const ApiClubCategories: ApiOperator<keyof ClubCategoriesController> = {
  FindAll: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'clubCategories',
        ClubCategoryDto,
        { isArray: true },
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
