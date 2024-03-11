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
  constructor(
    @Inject(S3_CLIENT_TOKEN)
    private readonly s3Client: S3Client,
    private readonly appConfigService: AppConfigService,
  ) {}

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

      const S3_ADDRESS = this.appConfigService.get<string>(
        ENV_KEY.AWS_S3_ADDRESS,
      );

      return `${S3_ADDRESS}/${filename}`;
    } catch (error) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: 'Failed upload file to S3',
        stack: error.stack,
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
        stack: error.stack,
      });
    }
  }
}
