import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { FreePostReplyCommentsController } from '@src/apis/free-post-reply-comments/controllers/free-post-reply-comments.controller';
import { FreePostReplyCommentDto } from '@src/apis/free-post-reply-comments/dto/free-post-reply-comment.dto';
import { FreePostReplyCommentsItemDto } from '@src/apis/free-post-reply-comments/dto/free-post-reply-comments-item.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { REACTION_ERROR_CODE } from '@src/constants/error/reaction/reaction-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { DeleteResponseDto } from '@src/interceptors/success-interceptor/dto/delete-response.dto';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { PaginationResponseDto } from '@src/interceptors/success-interceptor/dto/pagination-response.dto';
import { ApiOperator } from '@src/types/type';
import { ValidationError } from '@src/types/validation-errors.type';

/**
 * @todo
 */
export const ApiFreePostReplyComment: ApiOperator<
  keyof FreePostReplyCommentsController
> = {
  Create: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'freePostReplyComment',
        FreePostReplyCommentDto,
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
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
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
        ...apiOperationOptions,
      }),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'freePostReplyComments',
        FreePostReplyCommentsItemDto,
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
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
      ]),
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
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'freePostReplyComment',
        FreePostReplyCommentDto,
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
      HttpException.swaggerBuilder(HttpStatus.FORBIDDEN, [
        COMMON_ERROR_CODE.PERMISSION_DENIED,
      ]),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
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
      ApiBearerAuth(),
      DeleteResponseDto.swaggerBuilder(HttpStatus.OK, 'freePost'),
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
      HttpException.swaggerBuilder(HttpStatus.FORBIDDEN, [
        COMMON_ERROR_CODE.PERMISSION_DENIED,
      ]),
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
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
      ApiBearerAuth(),
      ApiNoContentResponse(),
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
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        REACTION_ERROR_CODE.ALREADY_LIKED,
      ]),
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
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
      ApiBearerAuth(),
      ApiNoContentResponse(),
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
      HttpException.swaggerBuilder(HttpStatus.NOT_FOUND, [
        COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      ]),
      HttpException.swaggerBuilder(HttpStatus.CONFLICT, [
        REACTION_ERROR_CODE.NOT_LIKED,
      ]),
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
      ]),
    );
  },
};
