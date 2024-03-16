import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';
import { FormDataRequest } from 'nestjs-form-data';

import { ApiAttachments } from '@src/apis/attachments/controllers/attachments.swagger';
import { AttachmentDto } from '@src/apis/attachments/dto/attachment.dto';
import { FileUploadDto } from '@src/apis/attachments/dto/file-upload.dto';
import { AttachmentsService } from '@src/apis/attachments/services/attachments.service';
import { JwtAuthGuard } from '@src/apis/auth/jwt/jwt.guard';
import { UserDto } from '@src/apis/users/dto/user.dto';
import { ApiCommonResponse } from '@src/decorators/swagger/api-common-response.swagger';
import { User } from '@src/decorators/user.decorator';
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
  @FormDataRequest()
  @UseGuards(JwtAuthGuard)
  @Post()
  async uploadFiles(
    @User() user: UserDto,
    @Body() fileUploadDto: FileUploadDto,
  ): Promise<AttachmentDto[]> {
    const attachments = await this.attachmentsService.uploadFiles(
      user.id,
      fileUploadDto,
    );

    return plainToInstance(AttachmentDto, attachments);
  }
}
