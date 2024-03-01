import { Injectable } from '@nestjs/common';

import { getTsid } from 'tsid-ts';
import { Transactional } from 'typeorm-transactional';

import { CreateAttachmentDto } from '@src/apis/attachments/dto/create-attachment.dto';
import { AttachmentRepository } from '@src/apis/attachments/repository/attachment.repository';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { S3Service } from '@src/s3/services/s3.service';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
    private readonly s3Service: S3Service,
  ) {}

  @Transactional()
  async uploadFiles(userId: number, files: Express.Multer.File[]) {
    if (files.length > 1) {
      throw new HttpBadRequestException({
        code: COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
        errors: [
          {
            reason: `can't upload more than one file.`,
            property: 'files',
          },
        ],
      });
    }

    const uploadedUrls: string[] = [];
    const filenames: string[] = [];

    for (const file of files) {
      const filename = getTsid().toBigInt().toString();

      const fileUrl = await this.s3Service.uploadImagesToS3(file, filename);

      uploadedUrls.push(fileUrl);

      filenames.push(filename);
    }

    const attachmentsItemDto = files.map((file, index) => {
      return new CreateAttachmentDto({
        id: filenames[index],
        userId,
        url: uploadedUrls[index],
        path: filenames[index],
        mimeType: file.mimetype,
        capacity: file.size,
      });
    });

    return this.attachmentRepository.save(attachmentsItemDto);
  }
}
