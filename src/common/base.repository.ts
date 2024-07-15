import { Repository } from 'typeorm';

import { BaseEntity } from '@src/common/base.entity';
import { IBaseMapper } from '@src/common/base.mapper';
import { isNil } from '@src/common/common';
import { RepositoryPort } from '@src/common/repository.port';

export abstract class BaseRepository<
  Entity extends BaseEntity<unknown>,
  Schema extends { id: string },
> implements RepositoryPort<Entity>
{
  constructor(
    protected readonly repository: Repository<any>,
    protected readonly mapper: IBaseMapper<Entity, Schema>,
  ) {}

  async insert(entity: Entity): Promise<void> {
    const record = this.mapper.toPersistence(entity);

    await this.repository.save(record, { reload: false });
  }

  async exist(id: string): Promise<boolean> {
    const isExist = await this.repository.exist({
      where: {
        id,
      },
    });

    return isExist;
  }

  async findOne(id: string): Promise<Entity | undefined> {
    const record = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (isNil(record)) {
      return;
    }

    return this.mapper.toEntity(record);
  }

  async update(entity: Entity): Promise<void> {
    const record = this.mapper.toPersistence(entity);

    await this.repository.update(
      {
        id: record.id,
      },
      record,
    );
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete({ id });
  }
}
