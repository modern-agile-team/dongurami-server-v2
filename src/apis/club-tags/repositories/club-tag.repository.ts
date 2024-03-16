import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ClubTag } from '@src/entities/ClubTag';

@CustomRepository(ClubTag)
export class ClubTagRepository extends Repository<ClubTag> {}
