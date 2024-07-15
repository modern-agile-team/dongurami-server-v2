import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { FreePost } from '@src/apis/free-posts/entities/free-post.entity';
import { FreePostMap } from '@src/apis/free-posts/mappers/free-post.map';
import {
  FreePostFilter,
  IFreePostRepository,
} from '@src/apis/free-posts/repositories/free-post.repository.interface';
import { BaseRepository } from '@src/common/base.repository';
import {
  PageBasePaginated,
  PageBasePaginatedParams,
} from '@src/common/repository.port';
import { FreePost as FreePostOrmEntity } from '@src/entities/FreePost';
import { QueryHelper } from '@src/helpers/query.helper';

@Injectable()
export class FreePostRepository
  extends BaseRepository<FreePost, FreePostOrmEntity>
  implements IFreePostRepository
{
  private readonly LIKE_SEARCH_FIELD = ['title'] as const;

  constructor(
    @InjectRepository(FreePostOrmEntity)
    repository: Repository<FreePostOrmEntity>,

    private readonly queryHelper: QueryHelper,
  ) {
    super(repository, FreePostMap);
  }

  async findAllPageBasePaginated(
    params: PageBasePaginatedParams<FreePost, FreePostFilter>,
  ): Promise<PageBasePaginated<FreePost>> {
    const { limit, page, orderBy, filter } = params;

    const where = this.queryHelper.buildWherePropForFind(
      filter,
      this.LIKE_SEARCH_FIELD,
    );
    const order = this.queryHelper.buildOrderProps(orderBy);

    const [posts, count] = await this.repository.findAndCount({
      select: {
        id: true,
        userId: true,
        title: true,
        hit: true,
        isAnonymous: true,
        createdAt: true,
        updatedAt: true,
      },
      where,
      order,
      skip: page * limit,
      take: limit,
      relations: {
        user: true,
      },
    });

    return new PageBasePaginated({
      count,
      limit,
      page,
      data: posts.map(this.mapper.toEntity),
    });
  }
}

export const FREE_POST_REPOSITORY_TOKEN = Symbol(FreePostRepository.name);
