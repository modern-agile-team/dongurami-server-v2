import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { NoticePostTagLink } from '@src/entities/NoticePostTagLink';

@CustomRepository(NoticePostTagLink)
export class NoticePostTagLinkRepository extends Repository<NoticePostTagLink> {}
