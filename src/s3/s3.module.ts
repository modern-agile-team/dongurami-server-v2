import { Module } from '@nestjs/common';

import { S3Provider } from '@src/s3/providers/s3.provider';
import { S3Service } from '@src/s3/services/s3.service';

@Module({
  providers: [...S3Provider, S3Service],
  exports: [...S3Provider, S3Service],
})
export class S3Module {}
