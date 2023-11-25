import { AUTH_ERROR_CODE } from '@src/apis/auth/constants/auth-error-code.constant';
import { ErrorMessage } from '@src/types/type';

export const AUTH_ERROR_MESSAGE: ErrorMessage<typeof AUTH_ERROR_CODE> = {
  [AUTH_ERROR_CODE.ACCOUNT_NOT_FOUND]: 'The account was not found.',
  [AUTH_ERROR_CODE.DIFFERENT_ACCOUNT_INFORMATION]:
    "Your account information doesn't match.",
} as const;
