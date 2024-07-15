import { FreePost } from '@src/apis/free-posts/entities/free-post.entity';
import { EntityId } from '@src/common/base.entity';
import {
  PageBasePaginated,
  PageBasePaginatedParams,
  RepositoryPort,
} from '@src/common/repository.port';

import { FreePostStatus } from '../entities/free-post.entity';

export interface FreePostFilter {
  userId?: EntityId;
  title?: string;
  isAnonymous?: boolean;
  status?: FreePostStatus;
}

export interface IFreePostRepository extends RepositoryPort<FreePost> {
  findAllPageBasePaginated(
    params: PageBasePaginatedParams<FreePost, FreePostFilter>,
  ): Promise<PageBasePaginated<FreePost>>;
}
