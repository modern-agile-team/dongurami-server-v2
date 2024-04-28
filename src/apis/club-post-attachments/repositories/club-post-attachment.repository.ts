import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubPostAttachment } from '@src/entities/ClubPostAttachment';

@CustomRepository(ClubPostAttachment)
export class ClubPostAttachmentRepository extends Repository<ClubPostAttachment> {}
