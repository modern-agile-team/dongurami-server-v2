import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { FreePost } from '@src/entities/FreePost';

@CustomRepository(FreePost)
export class FreePostRepository extends Repository<FreePost> {}
