import { NOTICE_POST_COMMENT_ERROR_CODE } from '@src/constants/error/notice-post-comment/notice-post-comment-error-code.constant';
import { ErrorMessage } from '@src/types/type';

/**
 * 7000 ~ 7999
 */
export const NOTICE_POST_COMMENT_ERROR_MESSAGE: ErrorMessage<
  typeof NOTICE_POST_COMMENT_ERROR_CODE
> = {
  [NOTICE_POST_COMMENT_ERROR_CODE.COMMENTS_DISABLED]:
    'Comments are disabled for this post.',
} as const;
