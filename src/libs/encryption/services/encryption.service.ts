import { Inject, Injectable } from '@nestjs/common';

import bcrypt from 'bcrypt';

import { BCRYPT_TOKEN } from '@src/libs/encryption/constants/encryption.token';

@Injectable()
export class EncryptionService {
  constructor(
    @Inject(BCRYPT_TOKEN)
    private readonly libBcrypt: typeof bcrypt,
  ) {}

  hash(data: string, salt: number) {
    return this.libBcrypt.hash(data, salt);
  }

  compare(data: string, encrypted: string) {
    return this.libBcrypt.compare(data, encrypted);
  }
}
