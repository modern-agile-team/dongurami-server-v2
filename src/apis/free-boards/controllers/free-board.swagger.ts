import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { FreeBoardsController } from '@src/apis/free-boards/controllers/free-boards.controller';
import { FreeBoardDto } from '@src/apis/free-boards/dto/free-board.dto';
import { FreeBoardsItemDto } from '@src/apis/free-boards/dto/free-boards-item.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { PaginationResponseDto } from '@src/interceptors/success-interceptor/dto/pagination-response.dto';
import { ApiOperator } from '@src/types/type';
import { ValidationError } from '@src/types/validation-errors.type';

export const ApiFreeBoard: ApiOperator<keyof FreeBoardsController> = {
  Create: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'FreeBoardCreate',
        ...apiOperationOptions,
      }),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'freeBoard',
        FreeBoardDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: ValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.UNAUTHORIZED, [
        COMMON_ERROR_CODE.INVALID_TOKEN,
      ]),
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
      ]),
    );
  },

  FindAllAndCount: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'FreeBoardFindAllAndCount',
        ...apiOperationOptions,
      }),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'freeBoards',
        FreeBoardsItemDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: ValidationError,
        },
      ),
    );
  },
  FindOneOrNotFound: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'FreeBoardFindOneOrNotFound',
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'freeBoard',
        FreeBoardDto,
      ),
      HttpException.swaggerBuilder(
        HttpStatus.BAD_REQUEST,
        [COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER],
        {
          description:
            '해당 필드는 request parameter 가 잘못된 경우에만 리턴됩니다.',
          type: ValidationError,
        },
      ),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
    );
  },
};
