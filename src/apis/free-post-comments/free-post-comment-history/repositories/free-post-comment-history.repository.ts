import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { FreePostCommentHistory } from '@src/entities/FreePostCommentHistory';

@CustomRepository(FreePostCommentHistory)
export class FreePostCommentHistoryRepository extends Repository<FreePostCommentHistory> {}
