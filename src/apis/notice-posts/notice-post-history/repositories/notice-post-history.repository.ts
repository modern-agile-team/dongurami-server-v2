import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { NoticePostHistory } from '@src/entities/NoticePostHistory';
import { Repository } from 'typeorm';

@CustomRepository(NoticePostHistory)
export class NoticePostHistoryRepository extends Repository<NoticePostHistory> {}
