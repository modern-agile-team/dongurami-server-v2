import { HttpException } from '@src/http-exceptions/exceptions/http.exception';

export type HttpError<E extends HttpException> = Pick<E, 'code' | 'errors'>;
