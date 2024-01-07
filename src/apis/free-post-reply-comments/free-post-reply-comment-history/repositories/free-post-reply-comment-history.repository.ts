import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { FreePostReplyCommentHistory } from '@src/entities/FreePostReplyCommentHistory';
import { Repository } from 'typeorm';

@CustomRepository(FreePostReplyCommentHistory)
export class FreePostReplyCommentHistoryRepository extends Repository<FreePostReplyCommentHistory> {}
