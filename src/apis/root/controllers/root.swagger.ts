import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { RootController } from '@src/apis/root/controllers/root.controller';
import { ErrorCodeResponseDto } from '@src/apis/root/dto/error-code-response.dto';
import { ApiOperator } from '@src/types/type';

export const ApiRoot: ApiOperator<keyof RootController> = {
  FindAllErrorCode: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'getFindAllErrorCode',
        ...apiOperationOptions,
      }),
      ApiOkResponse({ type: ErrorCodeResponseDto }),
    );
  },
};
