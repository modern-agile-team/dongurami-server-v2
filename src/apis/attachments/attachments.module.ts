import { Module } from '@nestjs/common';

import { AttachmentsController } from '@src/apis/attachments/controllers/attachments.controller';
import { AttachmentsService } from '@src/apis/attachments/services/attachments.service';
import { TypeOrmExModule } from '@src/core/type-orm/type-orm-ex.module';
import { Attachment } from '@src/entities/Attachment';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([Attachment])],
  controllers: [AttachmentsController],
  providers: [AttachmentsService],
})
export class AttachmentsModule {}
