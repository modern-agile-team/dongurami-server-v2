import { Module } from '@nestjs/common';

import { EncryptionModule } from '@src/libs/encryption/encryption.module';

@Module({
  imports: [EncryptionModule],
  exports: [EncryptionModule],
})
export class LibsModule {}
