import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { AppController } from '@src/app.controller';
import { ApiOperator } from '@src/types/type';

export const ApiRoot: ApiOperator<keyof AppController> = {
  FindAllErrorCode: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        operationId: 'getFindAllErrorCode',
        ...apiOperationOptions,
      }),
    );
  },
};
