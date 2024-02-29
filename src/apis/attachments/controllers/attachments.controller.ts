import {
  Controller,
  HttpStatus,
  ParseFilePipe,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';
import { Request } from 'express';

import { ApiAttachments } from '@src/apis/attachments/controllers/attachments.swagger';
import { AttachmentDto } from '@src/apis/attachments/dto/attachment.dto';
import { ParseFileBufferPipe } from '@src/apis/attachments/pipes/parse-file-buffer.pipe';
import { AttachmentsService } from '@src/apis/attachments/services/attachments.service';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { COMMON_ERROR_CODE } from '@src/constants/error/common/common-error-code.constant';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { User } from '@src/decorators/user.decorator';
import { HttpBadRequestException } from '@src/http-exceptions/exceptions/http-bad-request.exception';
import { ResponseType } from '@src/interceptors/success-interceptor/constants/success-interceptor.enum';
import { SetResponse } from '@src/interceptors/success-interceptor/decorators/success-response.decorator';

@ApiTags('attachment')
@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @ApiCommonResponse([
    HttpStatus.UNAUTHORIZED,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ])
  @ApiAttachments.UploadFiles({ summary: '파일 업로드 api' })
  @SetResponse({ type: ResponseType.Common, key: 'attachments' })
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      fileFilter(req, file, callback) {
        if (file.originalname !== 'test') {
          callback(
            new HttpBadRequestException({
              code: COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
              errors: [
                {
                  reason: 'test',
                  value: '흐엉',
                },
              ],
            }),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Post()
  async uploadFiles(
    @User() user: UserDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new ParseFileBufferPipe({})],
        exceptionFactory(validationError: string): any {
          throw new HttpBadRequestException({
            errors: [{ reason: validationError, property: 'files' }],
            code: COMMON_ERROR_CODE.INVALID_REQUEST_PARAMETER,
          });
        },
      }),
    )
    files: Express.Multer.File[],
  ): Promise<AttachmentDto[]> {
    const attachments = await this.attachmentsService.uploadFiles(
      user.id,
      files,
    );

    return plainToInstance(AttachmentDto, attachments);
  }
}
