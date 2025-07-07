import {
  ValidationOptions,
  registerDecorator,
  validate,
} from 'class-validator';

import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';

export function ValidateClassInstance(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'validateClassInstance',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: async (value: any): Promise<boolean> => {
          const validationErrors = await validate(value);

          if (validationErrors.length !== 0) {
            throw new HttpBadRequestException({
              code: COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
              errors: validationErrors.flatMap((validationError) => {
                return {
                  property: validationError.property,
                  value: validationError.value,
                  reason: Object.values(validationError.constraints)[0] || '',
                };
              }),
            });
          }

          return true;
        },
      },
    });
  };
}
