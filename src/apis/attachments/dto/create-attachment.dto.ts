import { OmitType } from '@nestjs/swagger';

import { AttachmentDto } from '@src/apis/attachments/dto/attachment.dto';

export class CreateAttachmentDto extends OmitType(AttachmentDto, [
  'createdAt',
  'updatedAt',
]) {
  constructor(createAttachmentDto: CreateAttachmentDto) {
    super();

    Object.assign(this, createAttachmentDto);
  }
}