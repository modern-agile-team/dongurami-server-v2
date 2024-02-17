import { Module } from '@nestjs/common';

import bcrypt from 'bcrypt';

import { BCRYPT_TOKEN } from '@src/libs/encryption/constants/encryption.token';
import { EncryptionService } from '@src/libs/encryption/services/encryption.service';

@Module({
  providers: [
    EncryptionService,
    {
      provide: BCRYPT_TOKEN,
      useValue: bcrypt,
    },
  ],
  exports: [EncryptionService],
})
export class EncryptionModule {}
