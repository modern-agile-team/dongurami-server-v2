import { EntityId } from '@src/common/base.entity';
import { SortOrder } from '@src/constants/enum';

export class PageBasePaginated<T> {
  readonly count: number;
  readonly limit: number;
  readonly page: number;
  readonly data: readonly T[];

  constructor(props: PageBasePaginated<T>) {
    this.count = props.count;
    this.limit = props.limit;
    this.page = props.page;
    this.data = props.data;
  }
}

export type OrderBy<T> = Partial<Record<keyof T, SortOrder>>[];

export interface PageBasePaginatedParams<T, Filter> {
  limit: number;
  page: number;
  orderBy: OrderBy<T>;
  filter: Filter;
}

export interface RepositoryPort<E> {
  insert(entity: E): Promise<void>;

  exist(id: EntityId): Promise<boolean>;

  findOne(id: EntityId): Promise<E | undefined>;

  update(entity: E): Promise<void>;

  delete(id: EntityId): Promise<void>;
}
