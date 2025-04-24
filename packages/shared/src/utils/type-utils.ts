export type DeepNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>>;
