import { Module } from '@nestjs/common';
import { BCRYPT_TOKEN } from '@src/libs/encryption/constants/encryption.token';
import bcrypt from 'bcrypt';
import { EncryptionService } from './services/encryption.service';

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
