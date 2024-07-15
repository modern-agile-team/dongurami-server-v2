import { Injectable } from '@nestjs/common';

import { FindOptionsRelations, In, Like } from 'typeorm';

import { isNil } from '@src/common/common';
import { OrderBy } from '@src/common/repository.port';

@Injectable()
export class QueryHelper {
  buildWherePropForFind<E extends Record<string, any>>(
    filter: Partial<Record<keyof E, E[keyof E]>>,
    likeSearchFields?: readonly (keyof E)[],
  ): Record<keyof E, any> {
    const where = <Record<keyof E, any>>{};

    for (const key in filter) {
      const value = filter[key];

      if (isNil(value)) {
        continue;
      }

      if (Number.isNaN(value)) {
        continue;
      }

      if (typeof value === 'string' && value.length === 0) {
        continue;
      }

      if (likeSearchFields?.includes(key)) {
        where[key] = Like(`%${value}%`);
      } else if (Array.isArray(value)) {
        where[key] = In(value);
      } else {
        where[key] = value;
      }
    }

    return where;
  }

  buildOrderProps(order: OrderBy<any>) {
    return order.reduce((acc, cur) => {
      const { field, param } = cur;

      acc[field] = param;

      return acc;
    }, {});
  }

  createNestedChildRelations(loadDepth: number): FindOptionsRelations<any> {
    if (loadDepth === 0) {
      return {};
    }

    return {
      children:
        loadDepth > 1
          ? this.createNestedChildRelations(loadDepth - 1)
          : {
              user: true,
            },
    };
  }

  aliasFactory<E extends Record<string, unknown>>(
    alias: string,
    object: Partial<E>,
  ) {
    const aliasedObject = <Record<string, any>>{};

    for (const key in object) {
      aliasedObject[`${alias}.${key}`] = object[key];
    }

    return aliasedObject;
  }
}
