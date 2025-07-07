import { CLUB_CATEGORY_ERROR_CODE } from '@src/constants/error/club-category/club-category-error-code.constant';
import { ErrorMessage } from '@src/types/type';

export const CLUB_CATEGORY_ERROR_MESSAGE: ErrorMessage<
  typeof CLUB_CATEGORY_ERROR_CODE
> = {
  [CLUB_CATEGORY_ERROR_CODE.ALREADY_EXIST_CLUB_CATEGORY_NAME]:
    'A category name that already exists.',
} as const;
