import { CLUB_MEMBER_ERROR_CODE } from '@src/constants/error/club-member/club-member-error-code.constant';
import { ErrorMessage } from '@src/types/type';

export const CLUB_MEMBER_ERROR_MESSAGE: ErrorMessage<
  typeof CLUB_MEMBER_ERROR_CODE
> = {
  [CLUB_MEMBER_ERROR_CODE.ALREADY_EXIST_CLUB_MEMBER]:
    'Already a member of the club.',
} as const;
