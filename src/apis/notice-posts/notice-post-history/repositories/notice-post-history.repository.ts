import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { NoticePostHistory } from '@src/entities/NoticePostHistory';

@CustomRepository(NoticePostHistory)
export class NoticePostHistoryRepository extends Repository<NoticePostHistory> {}
