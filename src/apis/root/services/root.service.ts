import { Injectable } from '@nestjs/common';
import { AUTH_ERROR_CODE } from '@src/constants/error/auth/auth-error-code.constant';
import { AUTH_ERROR_MESSAGE } from '@src/constants/error/auth/auth-error-message.constant';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { COMMON_ERROR_MESSAGE } from '@src/constants/error/common/common-error-message.constant';
import { MAJOR_ERROR_CODE } from '@src/constants/error/major/major-error-code.constant';
import { MAJOR_ERROR_MESSAGE } from '@src/constants/error/major/major-error-message.constant';
import { USER_ERROR_CODE } from '@src/constants/error/users/user-error-code.constant';
import { USER_ERROR_MESSAGE } from '@src/constants/error/users/user-error-message.constant';

@Injectable()
export class RootService {
  findAllErrorCode(): Record<string, { [x: number]: string }> {
    const buildExample = (
      code: Record<string, number>,
      msg: Record<string, string>,
    ) => {
      return Object.values(code).reduce((acc, cur) => {
        acc[cur] = msg[cur];

        return acc;
      }, {});
    };

    return {
      common: buildExample(COMMON_ERROR_CODE, COMMON_ERROR_MESSAGE),
      auth: buildExample(AUTH_ERROR_CODE, AUTH_ERROR_MESSAGE),
      users: buildExample(USER_ERROR_CODE, USER_ERROR_MESSAGE),
      majors: buildExample(MAJOR_ERROR_CODE, MAJOR_ERROR_MESSAGE),
    };
  }
}
