import { MAJOR_ERROR_CODE } from '@src/constants/error/major/major-error-code.constant';
import { ErrorMessage } from '@src/types/type';

export const MAJOR_ERROR_MESSAGE: ErrorMessage<typeof MAJOR_ERROR_CODE> = {
  [MAJOR_ERROR_CODE.ALREADY_EXIST_MAJOR_CODE]:
    'Major code that already exists.',
  [MAJOR_ERROR_CODE.ALREADY_EXIST_MAJOR_NAME]: 'Major name that already exists',
} as const;
