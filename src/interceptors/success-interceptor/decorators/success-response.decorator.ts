import { SetMetadata } from '@nestjs/common';
import { SET_RESPONSE } from '@src/interceptors/success-interceptor/constants/success-interceptor.constant';
import { Args } from '@src/interceptors/success-interceptor/types/success-interceptor.type';

export const SetResponse = (args: Args) => {
  return SetMetadata(SET_RESPONSE, args);
};
