import { Module } from '@nestjs/common';

import { S3Client } from '@aws-sdk/client-s3';

import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { S3_CLIENT_TOKEN } from '@src/s3/constants/s3-client.token';
import { S3Service } from '@src/s3/services/s3.service';

@Module({
  providers: [
    {
      provide: S3_CLIENT_TOKEN,
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return new S3Client({
          region: appConfigService.get<string>(ENV_KEY.AWS_REGION),
          credentials: {
            accessKeyId: appConfigService.get<string>(
              ENV_KEY.AWS_S3_ACCESS_KEY,
            ),
            secretAccessKey: appConfigService.get<string>(
              ENV_KEY.AWS_S3_SECRET_KEY,
            ),
          },
        });
      },
    },
    S3Service,
  ],
  exports: [S3Service],
})
export class S3Module {}
