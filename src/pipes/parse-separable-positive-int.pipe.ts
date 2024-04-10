import {
  ArgumentMetadata,
  Injectable,
  Optional,
  PipeTransform,
} from '@nestjs/common';

import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';

interface Options {
  separator?: string;
}

@Injectable()
export class ParseSeparablePositiveIntPipe implements PipeTransform<string> {
  constructor(
    @Optional()
    private readonly options: Options = {
      separator: ',',
    },
  ) {}

  transform(value: string, metadata: ArgumentMetadata) {
    const { type, data } = metadata;

    const values = value.split(this.options.separator);

    if (!values.every(this.isPositiveNumeric)) {
      throw new HttpBadRequestException({
        code: COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
        errors: [
          {
            value,
            property: data,
            reason: `${type} internal the ${data} must be a numeric string separated by "${this.options.separator}"`,
          },
        ],
      });
    }

    return values.map((value) => parseInt(value));
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
