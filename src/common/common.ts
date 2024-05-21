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
