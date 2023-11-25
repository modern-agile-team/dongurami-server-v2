import { USER_ERROR_CODE } from '@src/apis/users/constants/user-error-code.constant';
import { ErrorMessage } from '@src/types/type';

export const USER_ERROR_MESSAGE: ErrorMessage<typeof USER_ERROR_CODE> = {
  [USER_ERROR_CODE.ALREADY_EXIST_USER_EMAIL]: 'An email that already exists.',
  [USER_ERROR_CODE.ALREADY_EXIST_USER_PHONE_NUMBER]:
    'A cell phone number that already exists.',
} as const;
