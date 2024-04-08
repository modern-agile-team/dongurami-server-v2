import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { AdminsController } from '@src/apis/admins/controllers/admins.controller';
import { ClubCategoryDto } from '@src/apis/club-categories/dto/club-category.dto';
import { ClubWithCategoryAndTagDto } from '@src/apis/clubs/dto/club-with-category-and-tag.dto';
import { MajorDto } from '@src/apis/major/dto/major.dto';
import { CLUB_CATEGORY_ERROR_CODE } from '@src/constants/error/club-category/club-category-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { MAJOR_ERROR_CODE } from '@src/constants/error/major/major-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { CustomValidationError } from '@src/types/custom-validation-errors.type';
import { ApiOperator } from '@src/types/type';

export const ApiAdmins: ApiOperator<keyof AdminsController> = {
  CreateNewMajor: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(HttpStatus.CREATED, 'major', MajorDto),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: CustomValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        MAJOR_ERROR_CODE.ALREADY_EXIST_MAJOR_NAME,
        MAJOR_ERROR_CODE.ALREADY_EXIST_MAJOR_CODE,
      ]),
    );
  },

  CreateNewClub: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'club',
        ClubWithCategoryAndTagDto,
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
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.UNPROCESSABLE_ENTITY, [
        COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
      ]),
    );
  },

  CreateNewClubCategory: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'clubCategory',
        ClubCategoryDto,
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
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        CLUB_CATEGORY_ERROR_CODE.ALREADY_EXIST_CLUB_CATEGORY_NAME,
      ]),
    );
  },
};
