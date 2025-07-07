import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubTagLink } from '@src/entities/ClubTagLink';

@CustomRepository(ClubTagLink)
export class ClubTagLinkRepository extends Repository<ClubTagLink> {}
