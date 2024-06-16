import { ApiOperationOptions } from '@nestjs/swagger';

import { FindManyOptions, FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type ValueOf<T extends Record<any, any>> = T[keyof T];

export type ErrorMessage<T extends Record<string, number>> = Required<{
  [key in T[keyof T]]: string;
}>;

export type ApiOperator<M extends string> = {
  [key in Capitalize<M>]: (
    apiOperationOptions: Required<Pick<ApiOperationOptions, 'summary'>> &
      ApiOperationOptions,
  ) => PropertyDecorator;
};

export interface FindManyOptionsForPagination<E extends Record<string, any>>
  extends Required<
      Pick<FindManyOptions<E>, 'skip' | 'take' | 'order' | 'where'>
    >,
    FindManyOptions<E> {
  where: FindOptionsWhere<E>[] | FindOptionsWhere<E>;
  order: FindOptionsOrder<E>;
  skip: number;
  take: number;
}

export type ExcludeKeys<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};
