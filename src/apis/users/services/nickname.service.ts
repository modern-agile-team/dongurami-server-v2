import { Injectable } from '@nestjs/common';

import moment from 'moment';
import * as crypto from 'crypto';

@Injectable()
export class NicknameService {
  generateUniqueNickname(): string {
    const timestamp = moment().format('YYMMDDHHmmss');
    const randomString = crypto.randomBytes(2).toString('hex'); // 4자리 랜덤 문자열
    const uniqueNickname = `user_${timestamp}_${randomString}`;

    return uniqueNickname;
  }
}