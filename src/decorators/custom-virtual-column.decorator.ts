export const VIRTUAL_COLUMN_KEY = Symbol('VIRTUAL_COLUMN_KEY');

export const CustomVirtualColumn = (
  type: 'number' | 'boolean',
): PropertyDecorator => {
  return (target, propertyKey) => {
    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, target) || {};

    console.log;

    metaInfo[propertyKey] = { propertyKey, type };

    console.log(metaInfo);

    Reflect.defineMetadata(VIRTUAL_COLUMN_KEY, metaInfo, target);
  };
};
