import { REACTION_ERROR_CODE } from '@src/constants/error/reaction/reaction-error-code.constant';
import { ErrorMessage } from '@src/types/type';

export const REACTION_ERROR_MESSAGE: ErrorMessage<typeof REACTION_ERROR_CODE> =
  {
    [REACTION_ERROR_CODE.ALREADY_LIKED]: "You've already liked it.",
    [REACTION_ERROR_CODE.NOT_LIKED]: "You haven't liked it yet.",
  } as const;
