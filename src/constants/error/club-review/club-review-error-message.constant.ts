/**
 * 6000 ~ 6999
 */
import { CLUB_REVIEW_ERROR_CODE } from '@src/constants/error/club-review/club-review-error-code.constant';
import { ErrorMessage } from '@src/types/type';

export const CLUB_REVIEW_ERROR_MESSAGE: ErrorMessage<
  typeof CLUB_REVIEW_ERROR_CODE
> = {
  [CLUB_REVIEW_ERROR_CODE.ALREADY_REVIEWED]:
    "You've already reviewed this club.",
} as const;
