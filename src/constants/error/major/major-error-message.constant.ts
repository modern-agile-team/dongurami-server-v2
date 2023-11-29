import { ErrorMessage } from '@src/types/type';
import { MAJOR_ERROR_CODE } from './major-error-code.constant';

export const MAJOR_ERROR_MESSAGE: ErrorMessage<typeof MAJOR_ERROR_CODE> = {
  [MAJOR_ERROR_CODE.ALREADY_EXIST_MAJOR_CODE]: 'A code that already exists.',
  [MAJOR_ERROR_CODE.ALREADY_EXIST_MAJOR_NAME]: 'A name that already exists',
} as const;
