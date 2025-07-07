import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubCategoryLink } from '@src/entities/ClubCategoryLink';

@CustomRepository(ClubCategoryLink)
export class ClubCategoryLinkRepository extends Repository<ClubCategoryLink> {}
