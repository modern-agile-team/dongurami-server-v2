import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubPost } from '@src/entities/ClubPost';

@CustomRepository(ClubPost)
export class ClubPostRepository extends Repository<ClubPost> {}
