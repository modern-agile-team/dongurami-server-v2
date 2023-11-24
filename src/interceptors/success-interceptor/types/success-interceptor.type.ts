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
      type: Extract<ResponseType, ResponseType.Delete>;
      key: never;
    };
