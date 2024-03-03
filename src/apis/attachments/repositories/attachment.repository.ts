import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { Attachment } from '@src/entities/Attachment';

@CustomRepository(Attachment)
export class AttachmentRepository extends Repository<Attachment> {}
