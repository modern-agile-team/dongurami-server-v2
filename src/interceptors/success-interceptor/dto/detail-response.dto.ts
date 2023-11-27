import { HttpStatus, Type } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiProperty, ApiPropertyOptions, ApiResponse } from '@nestjs/swagger';

export class DetailResponseDto {
  [key: string]: unknown;

  static swaggerBuilder(
    status: Exclude<HttpStatus, ErrorHttpStatusCode>,
    key: string,
    type: Type,
    options: Omit<ApiPropertyOptions, 'name' | 'type' | 'isArray'> = {},
  ) {
    class Temp extends this {
      @ApiProperty({
        type,
        name: key,
        ...options,
      })
      private readonly temp: string;
    }

    Object.defineProperty(Temp, 'name', {
      value: `${key[0].toUpperCase()}${key.slice(1)}${this.name}`,
    });

    return ApiResponse({ status, type: Temp });
  }

  constructor(res: { [key: string]: unknown }) {
    Object.assign(this, res);
  }
}
