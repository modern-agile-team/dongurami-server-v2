import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { FreePostComment } from '@src/entities/FreePostComment';
import { Repository } from 'typeorm';

@CustomRepository(FreePostComment)
export class FreePostCommentRepository extends Repository<FreePostComment> {}
