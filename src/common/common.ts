import { SelectQueryBuilder } from 'typeorm';

import { VIRTUAL_COLUMN_KEY } from '@src/decorators/custom-virtual-column.decorator';

export const transformPage = ({ value }: { value: unknown }): number => {
  const page = Number(value);

  if (Number.isNaN(page)) {
    return page;
  }

  return page - 1;
};

export const isNil = (value: unknown): value is null | undefined => {
  return value === undefined || value === null;
};

export const isObject = (value: unknown): value is Record<any, any> => {
  return Object.prototype.toString.call(value) !== '[object Object]';
};

export const anonymize = <
  T extends {
    isAnonymous: boolean;
    userId: number;
    user: unknown;
  },
>(
  obj: T,
) => {
  if (obj.isAnonymous === false) {
    return obj;
  }

  if (!isNil(obj.userId)) {
    obj.userId = null;
  }

  if (!isNil(obj.user)) {
    obj.user = null;
  }

  return obj;
};

declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    getMany(this: SelectQueryBuilder<Entity>): Promise<Entity[] | undefined>;
    getOne(this: SelectQueryBuilder<Entity>): Promise<Entity | undefined>;
  }
}

SelectQueryBuilder.prototype.getMany = async function () {
  const { entities, raw } = await this.getRawAndEntities();

  const items = entities.map((entity, index) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};
    const item = raw[index];

    for (const [propertyKey, { propertyKey: name, type }] of Object.entries<{
      propertyKey: string;
      type: string;
    }>(metaInfo)) {
      const transformedValue =
        type === 'number'
          ? Number(item[name])
          : 'boolean'
            ? Boolean(item[name])
            : item[name];

      entity[propertyKey] = transformedValue;
    }

    return entity;
  });

  return [...items];
};

SelectQueryBuilder.prototype.getOne = async function () {
  const { entities, raw } = await this.getRawAndEntities();
  const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entities[0]) || {};

  for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
    entities[0][propertyKey] = raw[0][name];
  }

  return entities[0];
};
