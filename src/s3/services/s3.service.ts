import { Inject, Injectable } from '@nestjs/common';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { S3_CLIENT_TOKEN } from '@src/s3/constants/s3-client.token';

@Injectable()
export class S3Service {
  private readonly S3_ADDRESS: string;

  constructor(
    @Inject(S3_CLIENT_TOKEN)
    private readonly s3Client: S3Client,
    private readonly appConfigService: AppConfigService,
  ) {
    const BUCKET = this.appConfigService.get<string>(ENV_KEY.AWS_S3_BUCKET);
    const S3_REGION = this.appConfigService.get<string>(ENV_KEY.AWS_REGION);

    this.S3_ADDRESS = `https://${BUCKET}.s3.${S3_REGION}.amazonaws.com`;
  }

  async uploadImagesToS3(file: Express.Multer.File, filename: string) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.appConfigService.get<string>(ENV_KEY.AWS_S3_BUCKET),
        Key: filename,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      return `${this.S3_ADDRESS}/${filename}`;
    } catch (error) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: error,
      });
    }
  }
}
