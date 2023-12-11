import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { ReactionType } from '@src/entities/ReactionType';
import { Repository } from 'typeorm';

@CustomRepository(ReactionType)
export class ReactionTypeRepository extends Repository<ReactionType> {}
