import { Injectable } from '@nestjs/common';

import { getTsid } from 'tsid-ts';
import { Transactional } from 'typeorm-transactional';

import { CreateAttachmentDto } from '@src/apis/attachments/dto/create-attachment.dto';
import { FileUploadDto } from '@src/apis/attachments/dto/file-upload.dto';
import { AttachmentRepository } from '@src/apis/attachments/repository/attachment.repository';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { HttpInternalServerErrorException } from '@src/http-exceptions/exceptions/http-internal-server-error.exception';
import { S3Service } from '@src/s3/services/s3.service';

@Injectable()
export class AttachmentsService {
  constructor(
    private readonly attachmentRepository: AttachmentRepository,
    private readonly s3Service: S3Service,
  ) {}

  @Transactional()
  async uploadFiles(userId: number, fileUploadDto: FileUploadDto) {
    const { files } = fileUploadDto;

    const uploadedUrls: string[] = [];
    const filenames: string[] = [];

    await Promise.all(
      files.map(async (file) => {
        const filename = getTsid().toBigInt().toString();

        const fileUrl = await this.s3Service.uploadFileToS3(file, filename);

        uploadedUrls.push(fileUrl);
        filenames.push(filename);
      }),
    );

    try {
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

      return await this.attachmentRepository.save(attachmentsItemDto);
    } catch (error) {
      await this.s3Service.deleteFilesFromS3(filenames);

      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: 'Failed file upload',
        stack: error,
      });
    }
  }
}
