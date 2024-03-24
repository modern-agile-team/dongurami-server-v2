import { Repository } from 'typeorm';

import { CustomRepository } from '@src/core/type-orm/decorators/custom-repository.decorator';
import { PostTag } from '@src/entities/PostTag';

@CustomRepository(PostTag)
export class PostTagRepository extends Repository<PostTag> {}
