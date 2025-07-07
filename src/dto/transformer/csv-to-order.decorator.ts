import { applyDecorators } from '@nestjs/common';

import { Transform } from 'class-transformer';

import { SortOrder } from '@src/constants/enum';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';

export type Order<T extends readonly string[]> = Partial<
  Record<T[number], SortOrder>
>;

export const CsvToOrder = <T extends readonly string[] = readonly string[]>(
  fields: T[number][],
  defaultOrderBy: Partial<Record<T[number], SortOrder>> = {
    id: SortOrder.Desc,
  } as Record<T[number], SortOrder>,
): PropertyDecorator => {
  return applyDecorators(
    Transform(({ value }: { value: unknown }): Order<T> => {
      const getField = (field: string): T[number] => {
        return field.startsWith('-') ? field.slice(1) : field;
      };

      const getSortOrder = (field: string): SortOrder => {
        const isStartsWithDash = field.startsWith('-');

        return isStartsWithDash ? SortOrder.Desc : SortOrder.Asc;
      };

      // queryString 에 들어가는 transformer 인데 string 형태가 아닌 경우는 서버에러로 판단한다.
      if (typeof value !== 'string') {
        throw new HttpInternalServerErrorException({
          code: COMMON_ERROR_CODE.SERVER_ERROR,
          ctx: 'CsvToOrderBy 중 value 가 string type 이 아님',
        });
      }

      const requestOrders = value
        .split(',')
        .map((requestOrder) => requestOrder.trim());

      if (requestOrders.length === 0) {
        return defaultOrderBy;
      }

      const allowFields = requestOrders.filter((requestOrder) => {
        const field = getField(requestOrder);

        return fields.includes(field);
      });

      if (allowFields.length === 0) {
        return defaultOrderBy;
      }

      return allowFields.reduce(
        (acc, allowField) => {
          const field = getField(allowField);
          const sortOrder = getSortOrder(allowField);

          acc[field] = sortOrder;

          return acc;
        },
        <Record<T[number], SortOrder>>{},
      );
    }),
  );
};
