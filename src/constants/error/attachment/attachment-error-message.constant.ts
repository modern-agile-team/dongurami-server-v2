import { ATTACHMENT_ERROR_CODE } from '@src/constants/error/attachment/attachment-error-code.constant';
import { ErrorMessage } from '@src/types/type';

/**
 * 8000 ~ 8999
 */
export const ATTACHMENT_ERROR_MESSAGE: ErrorMessage<
  typeof ATTACHMENT_ERROR_CODE
> = {
  [ATTACHMENT_ERROR_CODE.PERMISSION_DENIED_ON_FILE]:
    "You don't have permission to access this file.",
} as const;
