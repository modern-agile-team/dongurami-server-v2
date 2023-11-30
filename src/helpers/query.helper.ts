import { Injectable } from '@nestjs/common';
import { isNil } from '@src/common/common';
import { Like } from 'typeorm';

@Injectable()
export class QueryHelper {
  buildWherePropForFind<E extends Record<string, any>>(
    filter: Partial<Record<keyof E, E[keyof E]>>,
    likeSearchFields?: (keyof Partial<E>)[],
  ): Record<keyof Partial<E>, any> {
    const where = <Record<keyof Partial<E>, any>>{};

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
      } else {
        where[key] = value;
      }
    }

    return where;
  }
}
