import { ATTACHMENT_ERROR_CODE } from '@src/constants/error/attachment/attachment-error-code.constant';
import { AUTH_ERROR_CODE } from '@src/constants/error/auth/auth-error-code.constant';
import { CLUB_CATEGORY_ERROR_CODE } from '@src/constants/error/club-category/club-category-error-code.constant';
import { CLUB_REVIEW_ERROR_CODE } from '@src/constants/error/club-review/club-review-error-code.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { MAJOR_ERROR_CODE } from '@src/constants/error/major/major-error-code.constant';
import { NOTICE_POST_COMMENT_ERROR_CODE } from '@src/constants/error/notice-post-comment/notice-post-comment-error-code.constant';
import { REACTION_ERROR_CODE } from '@src/constants/error/reaction/reaction-error-code.constant';
import { USER_ERROR_CODE } from '@src/constants/error/users/user-error-code.constant';

export const ERROR_CODE = {
  // 0 ~ 999
  ...COMMON_ERROR_CODE,
  // 1000 ~ 1999
  ...AUTH_ERROR_CODE,
  // 2000 ~ 2999
  ...USER_ERROR_CODE,
  // 3000 ~ 3999
  ...MAJOR_ERROR_CODE,
  // 4000 ~ 4999
  ...REACTION_ERROR_CODE,
  // 5000 ~ 5999
  ...CLUB_CATEGORY_ERROR_CODE,
  // 6000 ~ 6999
  ...CLUB_REVIEW_ERROR_CODE,
  // 7000 ~ 7999
  ...NOTICE_POST_COMMENT_ERROR_CODE,
  // 8000 ~ 8999
  ...ATTACHMENT_ERROR_CODE,
} as const;
