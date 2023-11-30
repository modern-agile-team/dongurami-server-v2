import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { ApiOperator } from '@src/types/type';
import { ValidationError } from '@src/types/validation-errors.type';
import { MajorController } from './major.controller';
import { MajorDto } from '../dto/major.dto';
import { MAJOR_ERROR_CODE } from '@src/constants/error/major/major-error-code.constant';
import { CommonResponseDto } from '@src/interceptors/success-interceptor/dto/common-response.dto';

export const ApiMajors: ApiOperator<keyof MajorController> = {
  CreateNewMajor: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'CreateNewMajor',
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(HttpStatus.CREATED, 'major', MajorDto),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: ValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        MAJOR_ERROR_CODE.ALREADY_EXIST_MAJOR_NAME,
        MAJOR_ERROR_CODE.ALREADY_EXIST_MAJOR_CODE,
      ]),
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
      ]),
    );
  },

  GetAllMajors: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'GetAllMajors',
        ...apiOperationOptions,
      }),
      CommonResponseDto.swaggerBuilder(HttpStatus.OK, 'major', MajorDto),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
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
