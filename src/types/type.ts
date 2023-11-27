export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type ErrorMessage<T extends Record<string, number>> = Required<{
  [key in T[keyof T]]: string;
}>;
