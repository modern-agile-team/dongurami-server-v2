import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';

@Injectable()
export class IsPositiveNumericPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    const { type, data } = metadata;

    if (!this.isPositiveNumeric(value)) {
      throw new HttpBadRequestException({
        code: COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
        errors: [
          {
            value,
            property: data,
            reason: `${type} internal the ${data} must be a numeric string`,
          },
        ],
      });
    }

    return value;
  }

  private isPositiveNumeric(value: string): boolean {
    return (
      ['string', 'number'].includes(typeof value) &&
      /^-?\d+$/.test(value) &&
      isFinite(value as any) &&
      Number(value) >= 1
    );
  }
}
