import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ReactionType } from '@src/entities/ReactionType';

@CustomRepository(ReactionType)
export class ReactionTypeRepository extends Repository<ReactionType> {}
