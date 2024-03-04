import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { FreePostCommentsController } from '@src/apis/free-post-comments/controllers/free-post-comments.controller';
import { FreePostCommentDto } from '@src/apis/free-post-comments/dto/free-post-comment.dto';
import { FreePostCommentsItemDto } from '@src/apis/free-post-comments/dto/free-post-comments-item.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { REACTION_ERROR_CODE } from '@src/constants/error/reaction/reaction-error-code.constant';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { DeleteResponseDto } from '@src/interceptors/success-interceptor/dto/delete-response.dto';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { PaginationResponseDto } from '@src/interceptors/success-interceptor/dto/pagination-response.dto';
import { ApiOperator } from '@src/types/type';
import { CustomValidationError } from '@src/types/custom-validation-errors.type';

export const ApiFreePostComment: ApiOperator<keyof FreePostCommentsController> =
  {
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
          'freePostComment',
          FreePostCommentDto,
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
      );
    },

    FindAllAndCount: (
      apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
        Partial<OperationObject>,
    ): PropertyDecorator => {
      return applyDecorators(
        ApiOperation({
          ...apiOperationOptions,
        }),
        PaginationResponseDto.swaggerBuilder(
          HttpStatus.OK,
          'freePostComments',
          FreePostCommentsItemDto,
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
      );
    },

    PutUpdate: (
      apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
        Partial<OperationObject>,
    ): PropertyDecorator => {
      return applyDecorators(
        ApiOperation({
          ...apiOperationOptions,
        }),
        ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN]),
        DetailResponseDto.swaggerBuilder(
          HttpStatus.OK,
          'freePostComment',
          FreePostCommentDto,
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
      );
    },

    Remove: (
      apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
        Partial<OperationObject>,
    ): PropertyDecorator => {
      return applyDecorators(
        ApiOperation({
          ...apiOperationOptions,
        }),
        ApiCommonResponse([HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN]),
        DeleteResponseDto.swaggerBuilder(HttpStatus.OK, 'freePost'),
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
      );
    },

    CreateReaction: (
      apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
        Partial<OperationObject>,
    ): PropertyDecorator => {
      return applyDecorators(
        ApiOperation({
          ...apiOperationOptions,
        }),
        ApiCommonResponse([HttpStatus.UNAUTHORIZED]),
        ApiNoContentResponse(),
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
        HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
          REACTION_ERROR_CODE.ALREADY_LIKED,
        ]),
      );
    },

    RemoveReaction: (
      apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
        Partial<OperationObject>,
    ): PropertyDecorator => {
      return applyDecorators(
        ApiOperation({
          ...apiOperationOptions,
        }),
        ApiCommonResponse([HttpStatus.UNAUTHORIZED]),
        ApiNoContentResponse(),
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
        HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
          REACTION_ERROR_CODE.NOT_LIKED,
        ]),
      );
    },
  };
