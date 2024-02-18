import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { NoticePostComment } from '@src/entities/NoticePostComment';

@CustomRepository(NoticePostComment)
export class NoticePostCommentRepository extends Repository<NoticePostComment> {}
