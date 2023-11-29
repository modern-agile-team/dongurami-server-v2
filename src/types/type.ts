import { ApiOperationOptions } from '@nestjs/swagger';

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
