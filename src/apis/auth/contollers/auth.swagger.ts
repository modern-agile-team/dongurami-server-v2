import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AuthController } from '@src/apis/auth/contollers/auth.controller';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { AUTH_ERROR_CODE } from '@src/constants/error/auth/auth-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { ApiOperator } from '@src/types/type';
import { ValidationError } from '@src/types/validation-errors.type';

export const ApiAuth: ApiOperator<keyof AuthController> = {
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
          type: ValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
      ]),
    );
  },

  GetProfile: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'user', UserDto),
      HttpException.swaggerBuilder(HttpStatus.UNAUTHORIZED, [
        COMMON_ERROR_CODE.INVALID_TOKEN,
      ]),
    );
  },

  GetAccessToken: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(HttpStatus.OK, 'user', UserDto),
      HttpException.swaggerBuilder(HttpStatus.UNAUTHORIZED, [
        COMMON_ERROR_CODE.INVALID_TOKEN,
      ]),
    );
  },
};
