import { Controller } from '@nestjs/common';

import { AttachmentsService } from '@src/apis/attachments/services/attachments.service';

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}
}
