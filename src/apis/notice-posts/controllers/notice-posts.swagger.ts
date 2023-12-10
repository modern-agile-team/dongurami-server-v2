import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { ApiOperator } from '@src/types/type';
import { ValidationError } from '@src/types/validation-errors.type';
import { NoticePostsController } from './notice-posts.controller';
import { DetailResponseDto } from '@src/interceptors/success-interceptor/dto/detail-response.dto';
import { NoticePostDto } from '../dto/notice-post.dto';
import { NoticePostsItemDto } from '../dto/notice-posts-item.dto';
import { PaginationResponseDto } from '@src/interceptors/success-interceptor/dto/pagination-response.dto';
import { DeleteResponseDto } from '@src/interceptors/success-interceptor/dto/delete-response.dto';

export const ApiNoticePost: ApiOperator<keyof NoticePostsController> = {
  Create: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'NoticePostCreate',
        ...apiOperationOptions,
      }),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'noticePost',
        NoticePostDto,
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
        operationId: 'NoticePostFindAllAndCount',
        ...apiOperationOptions,
      }),
      PaginationResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'noticePosts',
        NoticePostsItemDto,
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
        operationId: 'NoticePostFindOneOrNotFound',
        ...apiOperationOptions,
      }),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'noticePost',
        NoticePostDto,
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
      HttpException.swaggerBuilder(HttpStatus.INTERNAL_SERVER_ERROR, [
        COMMON_ERROR_CODE.SERVER_ERROR,
      ]),
    );
  },

  PutUpdate: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiProperty({
        operationId: 'NoticePostPutUpdate',
        ...apiOperationOptions,
      }),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'noticePost',
        NoticePostDto,
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
  PatchUpdate: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiProperty({
        operationId: 'NoticePostPatchUpdate',
        ...apiOperationOptions,
      }),
      ApiBearerAuth(),
      DetailResponseDto.swaggerBuilder(
        HttpStatus.OK,
        'noticePost',
        NoticePostDto,
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
      ApiProperty({
        operationId: 'NoticePostRemove',
        ...apiOperationOptions,
      }),
      ApiBearerAuth(),
      DeleteResponseDto.swaggerBuilder(HttpStatus.OK, 'noticePost'),
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
};
