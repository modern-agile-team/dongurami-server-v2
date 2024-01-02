import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { UsersController } from '@src/apis/users/controllers/users.controller';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { USER_ERROR_CODE } from '@src/constants/error/users/user-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { ApiOperator } from '@src/types/type';
import { ValidationError } from '@src/types/validation-errors.type';

export const ApiUsers: ApiOperator<keyof UsersController> = {
  Create: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'UsersCreate',
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(HttpStatus.CREATED, 'user', UserDto),
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
        USER_ERROR_CODE.ALREADY_EXIST_USER_EMAIL,
        USER_ERROR_CODE.ALREADY_EXIST_USER_PHONE_NUMBER,
      ]),
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
      ]),
    );
  },

  FindOneUserOrNotFound: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'FindOneUserOrNotFound',
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'user', UserDto),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },
};
