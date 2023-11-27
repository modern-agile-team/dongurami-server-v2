import { AUTH_ERROR_MESSAGE } from '@src/constants/error/auth/auth-error-message.constant';
import { COMMON_ERROR_MESSAGE } from '@src/constants/error/common/common-error-message.constant';
import { USER_ERROR_MESSAGE } from '@src/constants/error/users/user-error-message.constant';

export const ERROR_MESSAGE = {
  ...COMMON_ERROR_MESSAGE,
  ...USER_ERROR_MESSAGE,
  ...AUTH_ERROR_MESSAGE,
} as const;