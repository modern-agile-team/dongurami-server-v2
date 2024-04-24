import { Module } from '@nestjs/common';

import { ClubPostAttachmentRepository } from '@src/apis/club-post-attachments/repositories/club-post-attachment.repository';
import { ClubPostAttachmentsService } from '@src/apis/club-post-attachments/services/club-post-attachments.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ClubPostAttachmentRepository]),
  ],
  providers: [ClubPostAttachmentsService],
  exports: [ClubPostAttachmentsService],
})
export class ClubPostAttachmentsModule {}
