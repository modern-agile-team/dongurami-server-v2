export const VIRTUAL_COLUMN_KEY = Symbol('VIRTUAL_COLUMN_KEY');

export const CustomVirtualColumn = (
  type: 'number' | 'boolean',
): PropertyDecorator => {
  return (target, propertyKey) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, target) || {};

    metaInfo[propertyKey] = { propertyKey, type };

    Reflect.defineMetadata(VIRTUAL_COLUMN_KEY, metaInfo, target);
  };
};
