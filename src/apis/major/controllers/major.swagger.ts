import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

import { MajorController } from '@src/apis/major/controllers/major.controller';
import { MajorDto } from '@src/apis/major/dto/major.dto';
import { CommonResponseDto } from '@src/interceptors/success-interceptor/dto/common-response.dto';
import { ApiOperator } from '@src/types/type';

export const ApiMajors: ApiOperator<keyof MajorController> = {
  FindAllMajors: (
    apiOperationOptions: Required<Pick<Partial<OperationObject>, 'summary'>> &
      Partial<OperationObject>,
  ): PropertyDecorator => {
    return applyDecorators(
      ApiOperation({
        ...apiOperationOptions,
      }),
      CommonResponseDto.swaggerBuilder(HttpStatus.OK, 'majors', MajorDto, {
        isArray: true,
      }),
    );
  },
};
