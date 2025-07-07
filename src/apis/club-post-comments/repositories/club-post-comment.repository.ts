import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubPostComment } from '@src/entities/ClubPostComment';

@CustomRepository(ClubPostComment)
export class ClubPostCommentRepository extends Repository<ClubPostComment> {}
