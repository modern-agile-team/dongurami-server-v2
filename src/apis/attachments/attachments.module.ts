import { Module } from '@nestjs/common';

import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

import { AttachmentsController } from '@src/apis/attachments/controllers/attachments.controller';
import { AttachmentRepository } from '@src/apis/attachments/repositories/attachment.repository';
import { AttachmentsService } from '@src/apis/attachments/services/attachments.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { S3Module } from '@src/s3/s3.module';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([AttachmentRepository]),
    S3Module,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
