import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { FreePostComment } from '@src/entities/FreePostComment';

@CustomRepository(FreePostComment)
export class FreePostCommentRepository extends Repository<FreePostComment> {}
