import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { FreePostCommentHistory } from '@src/entities/FreePostCommentHistory';
import { Repository } from 'typeorm';

@CustomRepository(FreePostCommentHistory)
export class FreePostCommentHistoryRepository extends Repository<FreePostCommentHistory> {}
