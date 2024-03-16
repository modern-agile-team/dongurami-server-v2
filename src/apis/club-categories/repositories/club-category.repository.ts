import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubCategory } from '@src/entities/ClubCategory';

@CustomRepository(ClubCategory)
export class ClubCategoryRepository extends Repository<ClubCategory> {}
