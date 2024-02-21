import { Injectable } from '@nestjs/common';

import { ErrorCodeResponseDto } from '@src/apis/root/dto/error-code-response.dto';

@Injectable()
export class DevService {
  findAllErrorCode() {
    return new ErrorCodeResponseDto();
  }
}
