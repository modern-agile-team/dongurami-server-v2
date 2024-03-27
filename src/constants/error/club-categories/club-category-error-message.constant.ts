import { CLUB_CATEGORY_ERROR_CODE } from '@src/constants/error/club-categories/club-category-error-code.constant';
import { ErrorMessage } from '@src/types/type';

export const CLUB_CATEGORY_ERROR_MESSAGE: ErrorMessage<
  typeof CLUB_CATEGORY_ERROR_CODE
> = {
  [CLUB_CATEGORY_ERROR_CODE.CATEGORY_NOT_FOUND]:
    "The category you want to attach doesn't exist.",
} as const;
