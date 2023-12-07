import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { FreePost } from '@src/entities/FreePost';
import { Repository } from 'typeorm';

@CustomRepository(FreePost)
export class FreePostRepository extends Repository<FreePost> {}
