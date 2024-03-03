import { Inject, Injectable } from '@nestjs/common';

import {
  DeleteObjectsCommand,
  ObjectIdentifier,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { MemoryStoredFile } from 'nestjs-form-data';

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

  async uploadFileToS3(file: MemoryStoredFile, filename: string) {
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
        ctx: 'Failed upload file to S3',
        stack: error,
      });
    }
  }

  async deleteFilesFromS3(filenames: string[]) {
    try {
      const objects: ObjectIdentifier[] = filenames.map((filename) => {
        return {
          Key: filename,
        };
      });

      const command = new DeleteObjectsCommand({
        Bucket: this.appConfigService.get<string>(ENV_KEY.AWS_S3_BUCKET),
        Delete: {
          Objects: [...objects],
        },
      });

      await this.s3Client.send(command);
    } catch (error) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: 'Failed delete s3 objects',
        stack: error,
      });
    }
  }
}
