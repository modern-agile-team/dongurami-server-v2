import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';

export type Args =
  | {
      type: Extract<
        ResponseType,
        ResponseType.Common | ResponseType.Detail | ResponseType.Pagination
      >;
      key: string;
    }
  | {
      type: Extract<ResponseType, ResponseType.Pagination>;
      key?: string;
    }
  | {
      type: Extract<ResponseType, ResponseType.Delete>;
    };

export type CommonResponse<T> = T | Promise<T>;

export type DetailResponse<T> = T | Promise<T>;

export type PaginationResponse<T> = [T, number] | Promise<[T, number]>;

export type DeleteResponse = number | Promise<number>;
