import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { FreePostReplyComment } from '@src/entities/FreePostReplyComment';
import { Repository } from 'typeorm';

@CustomRepository(FreePostReplyComment)
export class FreePostReplyCommentRepository extends Repository<FreePostReplyComment> {}
