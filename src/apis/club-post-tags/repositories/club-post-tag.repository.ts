import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubPostTag } from '@src/entities/ClubPostTag';

@CustomRepository(ClubPostTag)
export class ClubPostTagRepository extends Repository<ClubPostTag> {}
