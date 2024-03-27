import { AUTH_ERROR_MESSAGE } from '@src/constants/error/auth/auth-error-message.constant';
import { CLUB_CATEGORY_ERROR_MESSAGE } from '@src/constants/error/club-categories/club-category-error-message.constant';
import { COMMON_ERROR_MESSAGE } from '@src/constants/error/common/common-error-message.constant';
import { MAJOR_ERROR_MESSAGE } from '@src/constants/error/major/major-error-message.constant';
import { REACTION_ERROR_MESSAGE } from '@src/constants/error/reaction/reaction-error-message.constant';
import { USER_ERROR_MESSAGE } from '@src/constants/error/users/user-error-message.constant';

export const ERROR_MESSAGE = {
  ...COMMON_ERROR_MESSAGE,
  ...AUTH_ERROR_MESSAGE,
  ...USER_ERROR_MESSAGE,
  ...MAJOR_ERROR_MESSAGE,
  ...REACTION_ERROR_MESSAGE,
  ...CLUB_CATEGORY_ERROR_MESSAGE,
} as const;
