import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { FreePostTagLink } from '@src/entities/FreePostTagLink';

@CustomRepository(FreePostTagLink)
export class FreePostTagLinkRepository extends Repository<FreePostTagLink> {}
