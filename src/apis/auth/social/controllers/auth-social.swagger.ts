import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { AuthSocialController } from '@src/apis/auth/social/controllers/auth-social.controller';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { AUTH_ERROR_CODE } from '@src/constants/error/auth/auth-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { USER_ERROR_CODE } from '@src/constants/error/users/user-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { CustomValidationError } from '@src/types/custom-validation-errors.type';
import { ApiOperator } from '@src/types/type';

export const ApiAuthSocial: ApiOperator<keyof AuthSocialController> = {
  CheckRegistration: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiCreatedResponse({
        type: Boolean,
      }),
    );
  },
  SignUp: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(HttpStatus.CREATED, 'user', UserDto),
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
        USER_ERROR_CODE.ALREADY_EXIST_USER_EMAIL,
        USER_ERROR_CODE.ALREADY_EXIST_USER_PHONE_NUMBER,
      ]),
    );
  },
  SignIn: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiCreatedResponse({
        schema: {
          properties: {
            accessToken: {
              description: 'access token',
              type: 'string',
            },
          },
        },
      }),
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
          type: CustomValidationError,
        },
      ),
    );
  },
};
