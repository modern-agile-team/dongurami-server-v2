import {
  ArgumentMetadata,
  Injectable,
  Optional,
  PipeTransform,
} from '@nestjs/common';

import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';

interface Options {
  transform?: boolean;
}

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string> {
  constructor(
    @Optional()
    private readonly options: Options = {
      transform: false,
    },
  ) {}

  transform(value: string, metadata: ArgumentMetadata): number | string {
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

    return this.options.transform ? parseInt(value, 10) : value;
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
