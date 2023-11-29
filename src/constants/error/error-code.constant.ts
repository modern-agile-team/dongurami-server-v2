import { AUTH_ERROR_CODE } from '@src/constants/error/auth/auth-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { USER_ERROR_CODE } from '@src/constants/error/users/user-error-code.constant';
import { MAJOR_ERROR_CODE } from './major/major-error-code.constant';

export const ERROR_CODE = {
  ...COMMON_ERROR_CODE,
  ...USER_ERROR_CODE,
  ...AUTH_ERROR_CODE,
  ...MAJOR_ERROR_CODE,
} as const;
