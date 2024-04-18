import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubPostTagLink } from '@src/entities/ClubPostTagLink';

@CustomRepository(ClubPostTagLink)
export class ClubPostTagLinkRepository extends Repository<ClubPostTagLink> {}
