import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { AttachmentsController } from '@src/apis/attachments/controllers/attachments.controller';
import { AttachmentDto } from '@src/apis/attachments/dto/attachment.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpException } from '@src/http-exceptions/exceptions/http.exception';
import { CommonResponseDto } from '@src/interceptors/success-interceptor/dto/common-response.dto';
import { CustomValidationError } from '@src/types/custom-validation-errors.type';
import { ApiOperator } from '@src/types/type';

export const ApiAttachments: ApiOperator<keyof AttachmentsController> = {
  UploadFiles: function (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      ApiConsumes('multipart/form-data'),
      ApiBody({
        description: '현재는 1개까지밖에 업로드 되지 않음.',
        schema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      }),
      CommonResponseDto.swaggerBuilder(
        HttpStatus.CREATED,
        'attachments',
        AttachmentDto,
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
