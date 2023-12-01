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
