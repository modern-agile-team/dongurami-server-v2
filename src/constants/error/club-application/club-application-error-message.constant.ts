import { CLUB_APPLICATION_ERROR_CODE } from '@src/constants/error/club-application/club-application-error-code.constant';
import { ErrorMessage } from '@src/types/type';

/**
 * 8000 ~ 8999
 */
export const CLUB_APPLICATION_ERROR_MESSAGE: ErrorMessage<
  typeof CLUB_APPLICATION_ERROR_CODE
> = {
  [CLUB_APPLICATION_ERROR_CODE.ALREADY_CLUB_MEMBER]:
    "Can't submit a club application because I'm already a member of a club.",
  [CLUB_APPLICATION_ERROR_CODE.PROCESSING_APPLICATION]:
    'Application has been processing.',
  [CLUB_APPLICATION_ERROR_CODE.NOT_APPLICATION_PERIOD]:
    'Not a club application period',
  [CLUB_APPLICATION_ERROR_CODE.MISSING_REQUIRED_QUESTION]:
    'Missing answers to required questions.',
  [CLUB_APPLICATION_ERROR_CODE.NOT_ALLOWED_ANSWER]:
    'The answer to the question is not an allowed value.',
  [CLUB_APPLICATION_ERROR_CODE.INVALID_APPLICATION_FORM]:
    "Answer doesn't match the format of the club application.",
  [CLUB_APPLICATION_ERROR_CODE.PROCESSED_APPLICATION]:
    'Application has been processed.',
} as const;
