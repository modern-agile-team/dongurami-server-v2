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
    getManyWithVirtualColumns(
      this: SelectQueryBuilder<Entity>,
      alias: string,
    ): Promise<Entity[] | undefined>;
  }
}

/**
 * @summary number type의 virtual column이고,
 * 단순 Count를 통해 개수만 집계하는 것이 아닌 집계하고자 Join한 테이블의 컬럼을
 * SELECT 시에는 정상적으로 작동하지 않음.
 */
SelectQueryBuilder.prototype.getManyWithVirtualColumns = async function (
  alias: string,
) {
  const { entities, raw } = await this.getRawAndEntities();

  const entityMap = new Map<number, { entity: any; aggregatedData: any }>();

  raw.forEach((item) => {
    const entityId = item[`${alias}_id`];

    if (!entityMap.has(entityId)) {
      const entity = entities.find((el) => el.id === entityId);
      const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};
      const aggregatedData = {};

      Object.keys(metaInfo).forEach((propertyKey) => {
        const { type } = metaInfo[propertyKey];
        aggregatedData[propertyKey] = type === 'number' ? 0 : null;
      });

      entityMap.set(entityId, { entity, aggregatedData });
    }

    const { entity, aggregatedData } = entityMap.get(entityId);

    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};
    Object.entries<{ propertyKey: string; type: 'number' | 'boolean' }>(
      metaInfo,
    ).forEach(([propertyKey, { propertyKey: name, type }]) => {
      const value = transformValue(item[name], type);

      aggregatedData[propertyKey] = value;
    });
  });

  const mappedEntities = Array.from(entityMap.values()).map(
    ({ entity, aggregatedData }) => {
      Object.assign(entity, aggregatedData);
      return entity;
    },
  );

  return mappedEntities;
};

function transformValue(value: any, type: 'number' | 'boolean') {
  if (type === 'number') {
    const numberValue = Number(value);
    return isNaN(numberValue) ? 0 : numberValue;
  } else if (type === 'boolean') {
    return Boolean(value);
  } else {
    return value;
  }
}

export const destructureExcludeKeys = <
  T extends Record<string, any>,
  K extends keyof T,
>(
  obj: T,
  keysToExclude: K[],
): Omit<T, K> => {
  const excludedObject = <Omit<T, K>>{};

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (!keysToExclude.includes(key as K)) {
      acc[key] = value;
    }
    return acc;
  }, excludedObject);
};
