import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { isNil } from '@src/common/common';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';

@ValidatorConstraint({ name: 'isBefore' })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(propertyValue: unknown, args: ValidationArguments) {
    const compareValue = args.object[args.constraints[0]];

    if (isNil(propertyValue) || isNil(compareValue)) {
      return true;
    }

    const dateTypeError = new HttpInternalServerErrorException({
      code: COMMON_ERROR_CODE.SERVER_ERROR,
      ctx: IsBeforeConstraint.name,
      stack: new Error().stack,
    });

    if (!(propertyValue instanceof Date)) {
      throw dateTypeError;
    }

    if (compareValue && !(compareValue instanceof Date)) {
      throw dateTypeError;
    }

    return propertyValue < compareValue;
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be before "${args.constraints[0]}"`;
  }
}
